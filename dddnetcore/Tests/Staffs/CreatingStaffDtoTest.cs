using Xunit;

namespace DDDSample1.Domain.Staffs.Tests
{
    public class CreatingStaffDtoTest
    {
        [Fact]
        public void CreatingStaffDtosTest()
        {
            var dto = new CreatingStaffDto
            {
                FirstName = "John",
                LastName = "Doe",
                FullName = "John Doe",
                LicenseNumber = "LN123456",
                SpecializationId = "specialization1",
                Email = "john.doe@example.com",
                PhoneNumber = "123456789",
                StaffAvailabilitySlots = "9:00-17:00",
                UserId = "O20240001@healthcare.com"
            };

            Assert.Equal("John", dto.FirstName);
            Assert.Equal("Doe", dto.LastName);
            Assert.Equal("John Doe", dto.FullName);
            Assert.Equal("LN123456", dto.LicenseNumber);
            Assert.Equal("specialization1", dto.SpecializationId);
            Assert.Equal("john.doe@example.com", dto.Email);
            Assert.Equal("123456789", dto.PhoneNumber);
            Assert.Equal("9:00-17:00", dto.StaffAvailabilitySlots);
            Assert.Equal("O20240001@healthcare.com", dto.UserId);
        }
    }
}
