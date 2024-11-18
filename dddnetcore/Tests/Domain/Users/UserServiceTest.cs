using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain.Users;
using DDDSample1.Domain.AuditLogs;
using Microsoft.Extensions.Configuration;
using Moq;
using Xunit;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Authentication;
using DDDSample1.Users;
using DDDSample1.Domain.Patients;
using DDDSample1.Infrastructure.Emails;
using System.Configuration;

namespace DDDSample1.Tests.Users
{
    public class UserServiceTest
    {
        private readonly UserService _userService;
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IConfiguration> _configurationMock;
        private readonly Mock<AuthenticationService> _authenticationServiceMock;
        private readonly Mock<IPatientRepository> _patientRepositoryMock;
        private readonly Mock<ILogRepository> _logRepositoryMock;
        private readonly Mock<IAnonimyzedPatientRepository> _anonimyzedPatientRepositoryMock;
        private readonly EmailService _emailService;
        private readonly List<User> _testUsers;

        public UserServiceTest()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _userRepositoryMock = new Mock<IUserRepository>();
            _configurationMock = new Mock<IConfiguration>();
            _authenticationServiceMock = new Mock<AuthenticationService>();
            _patientRepositoryMock = new Mock<IPatientRepository>();
            _logRepositoryMock = new Mock<ILogRepository>();
            _anonimyzedPatientRepositoryMock = new Mock<IAnonimyzedPatientRepository>();
            _emailService = null;
            _userService = new UserService(
                _unitOfWorkMock.Object,
                _userRepositoryMock.Object,
                _configurationMock.Object,
                _authenticationServiceMock.Object,
                _patientRepositoryMock.Object,
                _logRepositoryMock.Object,
                _anonimyzedPatientRepositoryMock.Object,
                _emailService
            );

            _testUsers = new List<User>
            {
                new User(new Role(RoleType.Doctor), new Email("joao.oliveira@test.com"), new Username("D20240001@healthcare.com")),
                new User(new Role(RoleType.Doctor), new Email("bruno.silva@test.com"), new Username("D20240002@healthcare.com"))
            };

            _userRepositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(_testUsers);
        }

        [Fact]
        public async Task GetAllAsync_ReturnsListOfUserDto()
        {
            var result = await _userService.GetAllAsync();

            Assert.Equal(2, result.Count);
            Assert.Equal("joao.oliveira@test.com", result[0].Email);
            Assert.Equal("bruno.silva@test.com", result[1].Email);
        }

        [Fact]
        public async Task GetByIdAsync_ReturnsUserDto_WhenUserExists()
        {
            var username = new Username("D20240001@healthcare.com");
            var user = _testUsers.Find(u => u.Id.Equals(username));

            _userRepositoryMock.Setup(repo => repo.GetByIdAsync(username)).ReturnsAsync(user);

            var result = await _userService.GetByIdAsync(username);

            Assert.NotNull(result);
            Assert.Equal(user.Id.ToString(), result.Username);
            Assert.Equal(user.Role.ToString(), result.Role);
            Assert.Equal(user.Email.ToString(), result.Email);

            _userRepositoryMock.Verify(repo => repo.GetByIdAsync(username), Times.Once);
        }

        [Fact]
        public async Task GetByIdAsync_ReturnsNull_WhenUserDoesNotExist()
        {
            var username = new Username("nonexistent@example.com");
            _userRepositoryMock.Setup(repo => repo.GetByIdAsync(username)).ReturnsAsync((User)null);

            var result = await _userService.GetByIdAsync(username);

            Assert.Null(result);
        }

        [Fact]
        public async Task UpdateAsync_UpdatesUser_WhenUserExists()
        {
            var username = new Username("D20240001@healthcare.com");
            var user = _testUsers.Find(u => u.Id.Equals(username));
            var updatedUserDto = new UserDto
            {
                Username = "D20240001@healthcare.com",
                Role = "Nurse",
                Email = "updated.email@test.com"
            };

            _userRepositoryMock.Setup(repo => repo.GetByIdAsync(It.IsAny<Username>())).ReturnsAsync(user);
            _unitOfWorkMock.Setup(uow => uow.CommitAsync()).ReturnsAsync(1);

            var result = await _userService.UpdateAsync(updatedUserDto);

            Assert.NotNull(result);
            Assert.Equal(updatedUserDto.Username, result.Username);
            Assert.Equal(updatedUserDto.Role, result.Role);
            Assert.Equal(updatedUserDto.Email, result.Email);

            _userRepositoryMock.Verify(repo => repo.GetByIdAsync(It.Is<Username>(u => u.Equals(username))), Times.Once);
            _unitOfWorkMock.Verify(uow => uow.CommitAsync(), Times.Once);
        }

        [Fact]
        public async Task UpdateAsync_ReturnsNull_WhenUserDoesNotExist()
        {
            var dto = new UserDto { Username = "nonexistent@example.com", Role = "Doctor", Email = "joao.oliveira@test.com" };
            _userRepositoryMock.Setup(repo => repo.GetByIdAsync(new Username(dto.Username))).ReturnsAsync((User)null);

            var result = await _userService.UpdateAsync(dto);

            Assert.Null(result);
        }

        [Fact]
        public async Task InactivateAsync_ReturnsUserDto_WhenUserDeactivatedSuccessfully()
        {
            var username = new Username("D20240001@healthcare.com");
            var user = _testUsers.Find(u => u.Id.Equals(username));
            
            _userRepositoryMock.Setup(repo => repo.GetByIdAsync(username)).ReturnsAsync(user);
            _unitOfWorkMock.Setup(uow => uow.CommitAsync()).ReturnsAsync(1);

            var result = await _userService.InactivateAsync(username);

            Assert.NotNull(result);
            Assert.Equal(user.Id.ToString(), result.Username);
            Assert.Equal(user.Role.ToString(), result.Role);
            Assert.Equal(user.Email.ToString(), result.Email);
            
            _userRepositoryMock.Verify(repo => repo.GetByIdAsync(username), Times.Once);
            _unitOfWorkMock.Verify(uow => uow.CommitAsync(), Times.Once);
        }


        [Fact]
        public async Task InactivateAsync_ReturnsNull_WhenUserDoesNotExist()
        {
            var username = new Username("nonexistent@example.com");
            _userRepositoryMock.Setup(repo => repo.GetByIdAsync(username)).ReturnsAsync((User)null);

            var result = await _userService.InactivateAsync(username);

            Assert.Null(result);
        }

        [Fact]
        public async Task FindByEmailAsync_ReturnsUserDto_WhenUserExists()
        {
            var email = "joao.oliveira@test.com";
            var user = _testUsers.Find(u => u.Email.ToString() == email);
            var expectedUserDto = new UserDto
            {
                Username = user.Id.ToString(),
                Role = user.Role.ToString(),
                Email = user.Email.ToString()
            };

            _userRepositoryMock.Setup(repo => repo.FindByEmailAsync(It.Is<Email>(e => e.EmailString == email))).ReturnsAsync(user);

            var result = await _userService.FindByEmailAsync(email);

            Assert.NotNull(result);
            Assert.Equal(expectedUserDto.Username, result.Username);
            Assert.Equal(expectedUserDto.Role, result.Role);
            Assert.Equal(expectedUserDto.Email, result.Email);

            _userRepositoryMock.Verify(repo => repo.FindByEmailAsync(It.Is<Email>(e => e.EmailString == email)), Times.Once);
        }

        [Fact]
        public async Task FindByEmailAsync_ReturnsNull_WhenUserDoesNotExist()
        {
            var email = "nonexistent@example.com";
            _userRepositoryMock.Setup(repo => repo.FindByEmailAsync(new Email(email))).ReturnsAsync((User)null);

            var result = await _userService.FindByEmailAsync(email);

            Assert.Null(result);
        }

        [Fact]
        public async Task GenerateUsernameAsync_ReturnsUsername()
        {
            var roleType = RoleType.Doctor;
            _userRepositoryMock.Setup(repo => repo.GetNextSequentialNumberAsync()).ReturnsAsync(1);

            var result = await _userService.GenerateUsernameAsync(roleType);

            Assert.Contains("D", result.UsernameString);
            Assert.Contains("2024", result.UsernameString);
        }
    }
}
