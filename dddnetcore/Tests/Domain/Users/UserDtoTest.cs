using DDDSample1.Domain.Users;
using Xunit;

namespace DDDSample1.Tests.Domain.Users
{
    public class UserDtoTest
    {
        [Fact]
        public void UserDto_ShouldAllowGetAndSetProperties()
        {
            var userDto = new UserDto();
            var username = "D20240001@healthcare.com";
            var role = "Doctor";
            var email = "test@example.com";

            userDto.Username = username;
            userDto.Role = role;
            userDto.Email = email;

            Assert.Equal(username, userDto.Username);
            Assert.Equal(role, userDto.Role);
            Assert.Equal(email, userDto.Email);
        }
    }
}
