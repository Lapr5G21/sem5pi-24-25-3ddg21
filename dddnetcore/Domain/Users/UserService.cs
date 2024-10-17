using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Users;
using DDDSample1.Infrastructure.Users;
using Microsoft.Extensions.Configuration;

namespace DDDSample1.Users
{
    public class UserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;

        public UserService(IUnitOfWork unitOfWork, IUserRepository userRepository, IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _userRepository = userRepository;
            _configuration = configuration;
        }

        // Obtém todos os usuários
        public async Task<List<UserDto>> GetAllAsync()
        {
            var list = await this._userRepository.GetAllAsync();
            List<UserDto> listDto = list.ConvertAll(user => new UserDto
            {
                Role = user.Role.ToString(),
                Username = user.Username.ToString(),
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
                Username = user.Username.ToString(),
                Email = user.Email.ToString()
            };
        }

        public async Task<UserDto> AddAsync(CreatingUserDto dto)
        {
            var roleType = (RoleType)Enum.Parse(typeof(RoleType), dto.Role, true);
            var role = new Role(roleType);
            var username = GenerateUsername(roleType);
            var user = new User(role, new Email(dto.Email),username);
            await this._userRepository.AddAsync(user);
            await this._unitOfWork.CommitAsync();

            return new UserDto
            {
                Role = user.Role.ToString(),
                Username = user.Username.ToString(),
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
                Username = user.Username.ToString(),
                Email = user.Email.ToString()
            };
        }

        public async Task<UserDto> DeleteAsync(Username username)
        {
            var user = await this._userRepository.GetByIdAsync(username);
            if (user == null) return null;

            this._userRepository.Remove(user);
            await this._unitOfWork.CommitAsync();

            return new UserDto
            {
                Role = user.Role.ToString(),
                Username = user.Username.ToString(),
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
                Username = user.Username.ToString(),
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
                Role = user.Role.ToString(),
                Username = user.Username.ToString(),
                Email = user.Email.ToString()
            };
        }

        public Username GenerateUsername(RoleType role)
        {
            var domain = "healthcare.com";
            string prefix;

            switch (role)
            {
                case RoleType.Doctor:
                    prefix = "D";
                    break;
                case RoleType.Nurse:
                    prefix = "N";
                    break;
                case RoleType.Technician:
                case RoleType.Admin:
                case RoleType.Patient:
                    prefix = "O";
                    break;
                default:
                    throw new ArgumentException("Invalid RoleType.");
            }

            var sequentialNumber = _userRepository.GetNextSequentialNumberAsync().Result;

            string username = $"{prefix}{DateTime.Now.Year}{sequentialNumber:D4}@{domain}";

            return new Username(username);
        }

    }
}
