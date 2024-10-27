using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using DDDSample1.Domain;
using DDDSample1.Domain.AuditLogs;
using DDDSample1.Domain.Authentication;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Users;
using DDDSample1.Infrastructure.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace DDDSample1.Users
{
    public class UserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;
        private readonly AuthenticationService _authenticationService;
        private readonly IPatientRepository _patientRepository;
        private readonly ILogRepository _logRepository;
        private readonly IAnonimyzedPatientRepository _anonimyzedPatientRepository;

        public UserService(IUnitOfWork unitOfWork, IUserRepository userRepository, IConfiguration configuration,AuthenticationService authenticationService,IPatientRepository patientRepository, ILogRepository logRepository, IAnonimyzedPatientRepository anonimyzedPatientRepository)
        {
            _unitOfWork = unitOfWork;
            _userRepository = userRepository;
            _configuration = configuration;
            _authenticationService=authenticationService;
            _patientRepository = patientRepository;
            _logRepository = logRepository;
            _anonimyzedPatientRepository = anonimyzedPatientRepository;
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

       
        
        public async Task<bool> DeleteAsync(Username username)
        {
            var user = await _userRepository.GetByIdAsync(username);
            if (user == null) return false;

            var patient = await _patientRepository.FindByEmailAsync(new PatientEmail(user.Email.EmailString));
            if (patient == null) return false;

            var auth0Domain = _configuration["Auth0:Domain"];
            var auth0ClientId = _configuration["Auth0:ClientId"];
            var auth0ClientSecret = _configuration["Auth0:ClientSecret"];
            var auth0UserId = $"auth0|{username.UsernameString}";

            var token = await _authenticationService.GetToken(auth0Domain, _configuration["Auth0:APIAudience"], auth0ClientId, auth0ClientSecret);

            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        
                var actionResponse = await httpClient.PostAsync($"https://{auth0Domain}/api/v2/actions/send-confirmation?userId={auth0UserId}", null);
        
                if (!actionResponse.IsSuccessStatusCode)
                {
                    var errorMessage = await actionResponse.Content.ReadAsStringAsync();
                    throw new Exception($"Failed to trigger confirmation email. Status Code: {actionResponse.StatusCode}. Error: {errorMessage}");
                }

                Console.WriteLine($"Confirmation email sent to {user.Email}");
                return true; 
            }
        }


        public async Task<UserDto> ConfirmDeletionAsync(Username username)
        {
            var user = await _userRepository.GetByIdAsync(username);
            if (user == null) return null;

            var patient = await _patientRepository.FindByEmailAsync(new PatientEmail(user.Email.EmailString));
            if (patient == null) return null;

            var auth0Domain = _configuration["Auth0:Domain"];
            var auth0ClientId = _configuration["Auth0:ClientId"];
            var auth0ClientSecret = _configuration["Auth0:ClientSecret"];
            var auth0UserId = $"auth0|{username.UsernameString}";

            var token = await _authenticationService.GetToken(auth0Domain, _configuration["Auth0:APIAudience"], auth0ClientId, auth0ClientSecret);

            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        
                var deleteResponse = await httpClient.DeleteAsync($"https://{auth0Domain}/api/v2/users/{auth0UserId}");
                if (!deleteResponse.IsSuccessStatusCode)
                {
                    var errorMessage = await deleteResponse.Content.ReadAsStringAsync();
                    throw new Exception($"Failed to delete user from Auth0. Status Code: {deleteResponse.StatusCode}. Error: {errorMessage}");
                }

                this._userRepository.Remove(user);
                if (patient != null)
                {
                    this._patientRepository.Remove(patient);
                }
                    await this._unitOfWork.CommitAsync();

                var log = _logRepository.LogDeleteOperation(LogCategoryType.USER, $"User with email {user.Email} was deleted");
                await _logRepository.AddAsync(log);

                var anonymizedPatient = _anonimyzedPatientRepository.CreateAnonimyzedPatient(
                patient.AppointmentHistory?.ToString() ?? "N/A",
                patient.MedicalRecord?.ToString() ?? "N/A");

                await _anonimyzedPatientRepository.AddAsync(anonymizedPatient);
                await this._unitOfWork.CommitAsync();

                return new UserDto
                {
                    Username = user.Id.ToString(),
                    Role = user.Role.ToString(),
                    Email = user.Email.ToString()
                };
            }
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

            string username = $"{prefix}{DateTime.Now.Year}{sequentialNumber:D4}{"@"}{domain}";
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
                password = dto.Password,
                connection = "Username-Password-Authentication",
                app_metadata = new Dictionary<string, object>
                {
                     {"roles", new string[] { role.ToString() }}
                },
                email_verified = false 
            };


            var token = await _authenticationService.GetToken(auth0Domain, auth0Audience, auth0ClientId, auth0ClientSecret);
            Console.WriteLine(token);
 
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
            password = dto.Password,
            connection="Username-Password-Authentication",
            app_metadata = new Dictionary<string, object>
                {
                     {"roles", new string[] { RoleType.Patient.ToString() }}
                },
                email_verified = false,
                user_id = dto.Email
            };

            var token = await _authenticationService.GetToken(auth0Domain, auth0Audience, auth0ClientId, auth0ClientSecret);
 
             using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

                var response = await client.PostAsJsonAsync($"https://{auth0Domain}/api/v2/users", auth0User);
                Console.WriteLine(response.ToString());

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    throw new HttpRequestException($"Request failed with status {response.StatusCode}: {errorContent}");
                }
            }

            var user1 = new User(new Role(RoleType.Patient), new Email(dto.Email), username);
            await this._userRepository.AddAsync(user);
            await this._unitOfWork.CommitAsync();

            return new UserDto
            {
                Role = user1.Role.ToString(),
                Username = user1.Id.ToString(),
                Email = user1.Email.ToString()
            };
        }

        public async Task<LoginUserDto> LoginAsync(RequestLoginDto requestLoginDto)
        {
            var auth0Domain = _configuration["Auth0:Domain"];
            var auth0ClientId = _configuration["Auth0:ClientId"];
            var auth0ClientSecret = _configuration["Auth0:ClientSecret"];
            var auth0Audience = _configuration["Auth0:Audience"];
            var tokenEndpoint = $"https://{auth0Domain}/oauth/token";

            var tokenRequestBody = new Dictionary<string, string> 
            {
                { "grant_type", "password" },
                { "username", requestLoginDto.Email },
                { "password", requestLoginDto.Password },
                { "client_id", auth0ClientId },
                { "client_secret", auth0ClientSecret },
                { "audience", auth0Audience },
                { "connection", "Username-Password-Authentication" },
            };

            var requestContent = new FormUrlEncodedContent(tokenRequestBody);

            using (var httpClient = new HttpClient())
            {
                var tokenResponse = await httpClient.PostAsync(tokenEndpoint, requestContent);

                if (tokenResponse.IsSuccessStatusCode)
                {
                    var tokenResponseBody = await tokenResponse.Content.ReadAsStringAsync();
                    var tokenResult = System.Text.Json.JsonSerializer.Deserialize<JsonElement>(tokenResponseBody);
                    string loginToken = tokenResult.GetProperty("access_token").GetString();

                    var handler = new JwtSecurityTokenHandler();
                    var jwtToken = handler.ReadJwtToken(loginToken);

                    var roles = jwtToken.Claims
                        .Where(c => c.Type == $"{_configuration["Auth0:Namespace"]}/roles")
                        .Select(c => c.Value)
                        .ToList();

                    return new LoginUserDto
                    {
                        LoginToken = loginToken,
                        Roles = roles
                    };
                }
                else
                {
                    var error = await tokenResponse.Content.ReadAsStringAsync();
                    throw new Exception($"Erro ao obter token de acesso: {error}");
                }
            }
        }
        
        public async Task ResetPasswordAsync(string email)
        {
            var auth0Domain = _configuration["Auth0:Domain"];
            var resetPasswordUrl = $"https://{auth0Domain}/dbconnections/change_password";

            var requestBody = new
            {
                email = email,
                connection = "Username-Password-Authentication"
            };

            using (var httpClient = new HttpClient())
            {
                var response = await httpClient.PostAsync(resetPasswordUrl, new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json"));

                if (!response.IsSuccessStatusCode)
                {
                    var error = await response.Content.ReadAsStringAsync();
                    throw new Exception($"Fail reset password: {error}");
                }
            }
        }

    
        
    }
}