using System;
using System.Threading.Tasks;
using Xunit;
using Moq;
using DDDSample1.Domain.Users;
using DDDSample1.Domain.Shared;
using DDDSample1.Users;
using System.Collections.Generic;

namespace DDDSample1.Tests.Domain.Users
{
    public class UserServiceTest
    {
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly UserService _userService;

        public UserServiceTest()
        {
            _userRepositoryMock = new Mock<IUserRepository>();
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _userService = new UserService(_unitOfWorkMock.Object, _userRepositoryMock.Object, null);
        }

        [Fact]
        public async Task GetAllAsyncTest()
        {
            var users = new List<User>
            {
                new User(
                    new Role(RoleType.Patient),
                    new Email("nurse@example.com"),
                    new Username("N20230001@healthcare.com")),
                new User(
                    new Role(RoleType.Doctor),
                    new Email("doctor@example.com"),
                    new Username("D20230002@healthcare.com"))
            };

            _userRepositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(users);

            var result = await _userService.GetAllAsync();

            Assert.Equal(2, result.Count);
            
            Assert.Equal("Nurse", result[0].Role);
            Assert.Equal("nurse@example.com", result[0].Email);
            Assert.Equal("N20230001@healthcare.com", result[0].Username);
            
            Assert.Equal("Doctor", result[1].Role);
            Assert.Equal("doctor@example.com", result[1].Email);
            Assert.Equal("D20230002@healthcare.com", result[1].Username);
        }

        [Fact]
        public async Task GetByIdAsyncUserExistsTest()
        {
            var username = new Username("D20230002@healthcare.com");
            var user = new User(
                new Role(RoleType.Doctor),
                new Email("doctor@example.com"),
                username);

            _userRepositoryMock.Setup(repo => repo.GetByIdAsync(username)).ReturnsAsync(user);

            var result = await _userService.GetByIdAsync(username);

            Assert.NotNull(result);
            Assert.Equal("Doctor", result.Role);
            Assert.Equal("doctor@example.com", result.Email);
            Assert.Equal("D20230002@healthcare.com", result.Username);
        }

        [Fact]
        public async Task AddAsyncValidUserTest()
        {
            var creatingUserDto = new CreatingUserDto("Doctor", "doctor@example.com");
            var generatedUsername = new Username("D20240001@healthcare.com");

            _userRepositoryMock.Setup(repo => repo.GetNextSequentialNumberAsync()).ReturnsAsync(1);

            var result = await _userService.AddAsync(creatingUserDto);

            Assert.NotNull(result);
            Assert.Equal("Doctor", result.Role);
            Assert.Equal("doctor@example.com", result.Email);
            Assert.Equal("D20240001@healthcare.com", result.Username);
            _userRepositoryMock.Verify(repo => repo.AddAsync(It.IsAny<User>()), Times.Once);
            _unitOfWorkMock.Verify(uow => uow.CommitAsync(), Times.Once);
        }

        [Fact]
        public async Task UpdateAsyncTest()
        {
            var existingUser = new User(new Role(RoleType.Doctor), new Email("doctor@example.com"), new Username("D20240001@healthcare.com"));
            var updateDto = new UserDto
            {
                Username = "D20240001@healthcare.com",
                Role = "Nurse",
                Email = "nurse@example.com"
            };

            _userRepositoryMock.Setup(repo => repo.GetByIdAsync(new Username(updateDto.Username))).ReturnsAsync(existingUser);

            var result = await _userService.UpdateAsync(updateDto);

            Assert.NotNull(result);
            Assert.Equal(updateDto.Role, result.Role);
            Assert.Equal(updateDto.Username, result.Username);
            Assert.Equal(updateDto.Email, result.Email);
            
            _userRepositoryMock.Verify(repo => repo.GetByIdAsync(new Username(updateDto.Username)), Times.Once);
            _unitOfWorkMock.Verify(uow => uow.CommitAsync(), Times.Once);
        }

        [Fact]
        public async Task UpdateAsyncUserNotFoundTest()
        {
            var updateDto = new UserDto
            {
                Username = "D20240001@healthcare.com",
                Role = "Nurse",
                Email = "nurse@example.com"
            };

            _userRepositoryMock.Setup(repo => repo.GetByIdAsync(new Username(updateDto.Username))).ReturnsAsync((User)null);

            var result = await _userService.UpdateAsync(updateDto);

            Assert.Null(result);
            _userRepositoryMock.Verify(repo => repo.GetByIdAsync(new Username(updateDto.Username)), Times.Once);
            _unitOfWorkMock.Verify(uow => uow.CommitAsync(), Times.Never);
        }

        [Fact]
        public async Task FindByEmailAsyncTest()
        {
            var existingUser = new User(new Role(RoleType.Doctor), new Email("doctor@example.com"), new Username("D20240001@healthcare.com"));

            _userRepositoryMock.Setup(repo => repo.FindByEmailAsync(new Email("doctor@example.com"))).ReturnsAsync(existingUser);

            var result = await _userService.FindByEmailAsync("doctor@example.com");

            Assert.NotNull(result);
            Assert.Equal(existingUser.Role.ToString(), result.Role);
            Assert.Equal(existingUser.Username.ToString(), result.Username);
            Assert.Equal(existingUser.Email.ToString(), result.Email);
            
            _userRepositoryMock.Verify(repo => repo.FindByEmailAsync(new Email("doctor@example.com")), Times.Once);
        }

        [Fact]
        public async Task GenerateUsernameAsyncTest()
        {
            var role = RoleType.Doctor;
            var sequentialNumber = 1;
            _userRepositoryMock.Setup(repo => repo.GetNextSequentialNumberAsync()).ReturnsAsync(sequentialNumber);

            var result = await _userService.GenerateUsernameAsync(role);

            var expectedUsername = $"D{DateTime.Now.Year}0001@healthcare.com";
            Assert.Equal(expectedUsername, result.ToString());
            _userRepositoryMock.Verify(repo => repo.GetNextSequentialNumberAsync(), Times.Once);
        }
    }
}
