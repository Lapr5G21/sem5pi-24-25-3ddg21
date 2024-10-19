using Xunit;
using DDDSample1.Domain.Users;

namespace DDDSample1.Tests.Domain.Users
{
    public class CreatingUserDtoTest
    {
        [Fact]
        public void Constructor_ShouldInitializeProperties()
        {
            string role = "Doctor";
            string email = "doctor@example.com";

            var dto = new CreatingUserDto(role, email);

            Assert.Equal(role, dto.Role);
            Assert.Equal(email, dto.Email);
        }

        [Fact]
        public void Properties_ShouldAllowSettingValues()
        {
            var dto = new CreatingUserDto("Doctor", "doctor@example.com");

            dto.Role = "Nurse";
            dto.Email = "nurse@example.com";

            Assert.Equal("Nurse", dto.Role);
            Assert.Equal("nurse@example.com", dto.Email);
        }
    }
}
