using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Threading.Tasks;
using DDDSample1.Domain;
using DDDSample1.Domain.Authentication;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Users;
using DDDSample1.Infrastructure.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace DDDSample1.Users
{
    public class UserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;
        private readonly AuthenticationService _authenticationService;
        private readonly IPatientRepository _patientRepository;

        public UserService(IUnitOfWork unitOfWork, IUserRepository userRepository, IConfiguration configuration,AuthenticationService authenticationService,IPatientRepository patientRepository)
        {
            _unitOfWork = unitOfWork;
            _userRepository = userRepository;
            _configuration = configuration;
            _authenticationService=authenticationService;
            _patientRepository = patientRepository;
        }

        // Obtém todos os usuários
        public async Task<List<UserDto>> GetAllAsync()
        {
            var list = await this._userRepository.GetAllAsync();
            List<UserDto> listDto = list.ConvertAll(user => new UserDto
            {
                Role = user.Role.ToString(),
                Username = user.Id.ToString(),
                Email = user.Email.ToString()
            });
            return listDto;
        }

        public async Task<UserDto> GetByIdAsync(Username username)
        {
            var user = await this._userRepository.GetByIdAsync(username);
            if (user == null) return null;

            return new UserDto
            {
                Role = user.Role.ToString(),
                Username = user.Id.ToString(),
                Email = user.Email.ToString()
            };
        }
        public async Task<UserDto> UpdateAsync(UserDto dto)
        {
            var user = await this._userRepository.GetByIdAsync(new Username(dto.Username));
            if (user == null) return null;
            var roleType = (RoleType)Enum.Parse(typeof(RoleType), dto.Role, true);
            user.ChangeRole(new Role(roleType));
            user.ChangeUsername(new Username(dto.Username));
            user.ChangeEmail(new Email(dto.Email));
            await this._unitOfWork.CommitAsync();

            return new UserDto
            {
                Role = user.Role.ToString(),
                Username = user.Id.ToString(),
                Email = user.Email.ToString()
            };
        }

        internal async Task<UserDto> InactivateAsync(Username username)
        {
            
            var user = await this._userRepository.GetByIdAsync(username);
            if (user == null) return null;

            user.DeactivateUser();
            
            await this._unitOfWork.CommitAsync();

            return new UserDto
            {
                Username = user.Id.ToString(),
                Role = user.Role.ToString(),
                Email = user.Email.ToString()
            };
        }


        public async Task<UserDto> DeleteAsync(Username username)
        {
            var user = await this._userRepository.GetByIdAsync(username);
            if (user == null) return null;

            if (user.Active)
                throw new BusinessRuleValidationException("It is not possible to delete an active user.");

            this._userRepository.Remove(user);
            await this._unitOfWork.CommitAsync();

            return new UserDto
            {
                Username = user.Id.ToString(),
                Role = user.Role.ToString(),
                Email = user.Email.ToString()
            };
        }

        public async Task<UserDto> FindByEmailAsync(string email)
        {
            var user = await this._userRepository.FindByEmailAsync(new Email(email));
            if (user == null) return null;

            return new UserDto
            {
                Role = user.Role.ToString(),
                Username = user.Id.ToString(),
                Email = user.Email.ToString()
            };
        }

        public async Task<Username> GenerateUsernameAsync(RoleType role)
        {
            var domain = "healthcare.com";
            string prefix = role switch
            {
                RoleType.Doctor => "D",
                RoleType.Nurse => "N",
                RoleType.Technician or RoleType.Admin or RoleType.Patient => "O",
                _ => throw new ArgumentException("Invalid RoleType."),
            };
            var sequentialNumber = await _userRepository.GetNextSequentialNumberAsync();

            string username = $"{prefix}{DateTime.Now.Year}{sequentialNumber:D4}";

            return new Username(username);
        }

        public async Task<UserDto> AddBackofficeUserAsync(CreatingUserDto dto)
        {
            var users = await _userRepository.GetAllAsync();
            if (users.Any(x => x.Email.ToString() == dto.Email))
            {
                throw new BusinessRuleValidationException("Email is already taken");
            }

            var roleType = (RoleType)Enum.Parse(typeof(RoleType), dto.Role, true);
            var role = new Role(roleType);
            var username = await GenerateUsernameAsync(roleType);

            var auth0Domain = _configuration["Auth0:Domain"];
            var auth0Audience = _configuration["Auth0:APIAudience"];
            var auth0ClientId = _configuration["Auth0:ClientId"];
            var auth0ClientSecret = _configuration["Auth0:ClientSecret"];
            var auth0User = new
            {
                email = dto.Email,
                username = username.ToString(),
                password = dto.Password,
                connection = "Username-Password-Authentication"
            };

            var token = await _authenticationService.GetToken(auth0Domain, auth0Audience, auth0ClientId, auth0ClientSecret);
 
             using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

                var response = await client.PostAsJsonAsync($"https://{auth0Domain}/api/v2/users", auth0User);

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    throw new HttpRequestException($"Request failed with status {response.StatusCode}: {errorContent}");
                }
            }

            var user = new User(role, new Email(dto.Email), username);
            await this._userRepository.AddAsync(user);
            await this._unitOfWork.CommitAsync();

            return new UserDto
            {
                Role = user.Role.ToString(),
                Username = user.Id.ToString(),
                Email = user.Email.ToString()
            };
        }



         public async Task<UserDto> AddPatientUserSync(CreatingPatientUserDto dto)
        {

            Patient patient = await _patientRepository.FindByEmailAsync(new PatientEmail(dto.Email));
            if(patient == null) {
                throw new BusinessRuleValidationException("Patient profile is not created , so is not possible to create an account");
            }
            var users = await _userRepository.GetAllAsync();
            if (users.Any(x => x.Email.ToString() == dto.Email))
            {
                throw new BusinessRuleValidationException("Email is already taken");
            }

            var username = new Username(dto.Email);

            var user = new User(new Role(RoleType.Patient), new Email(dto.Email), username);
            patient.SetUser(user);
            
            var auth0Domain = _configuration["Auth0:Domain"];
            var auth0Audience = _configuration["Auth0:APIAudience"];
            var auth0ClientId = _configuration["Auth0:ClientId"];
            var auth0ClientSecret = _configuration["Auth0:ClientSecret"];

            var auth0User = new
            {       
            email = dto.Email,
            username = username.ToString(),
            password = dto.Password, 
            connection="Username-Password-Authentication"
            };

            var client = new HttpClient();
            var token = await _authenticationService.GetToken(auth0Domain, auth0Audience, auth0ClientId, auth0ClientSecret);
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await client.PostAsJsonAsync($"https://{auth0Domain}/api/v2/users", auth0User);
            response.EnsureSuccessStatusCode();
            await this._userRepository.AddAsync(user);
            await this._unitOfWork.CommitAsync();
            
            return new UserDto
            {
                Role = user.Role.ToString(),
                Username = user.Id.ToString(),
                Email = user.Email.ToString()
            };
        }


    
    }
}
