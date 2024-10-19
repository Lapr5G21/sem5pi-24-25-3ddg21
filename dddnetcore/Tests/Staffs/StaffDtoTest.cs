using Xunit;

namespace DDDSample1.Domain.Staffs.Tests
{
    public class StaffDtoTest
    {
        [Fact]
        public void StaffDtosTest()
        {
            var dto = new StaffDto
            {
                StaffId = "1",
                StaffFirstName = "John",
                StaffLastName = "Doe",
                StaffFullName = "John Doe",
                StaffLicenseNumber = "LN123456",
                SpecializationId = "specialization1",
                StaffEmail = "john.doe@example.com",
                StaffPhoneNumber = "123456789",
                StaffAvailabilitySlots = "9:00-17:00",
                UserId = "O20240001@healthcare.com"
            };

            Assert.Equal("1", dto.StaffId);
            Assert.Equal("John", dto.StaffFirstName);
            Assert.Equal("Doe", dto.StaffLastName);
            Assert.Equal("John Doe", dto.StaffFullName);
            Assert.Equal("LN123456", dto.StaffLicenseNumber);
            Assert.Equal("specialization1", dto.SpecializationId);
            Assert.Equal("john.doe@example.com", dto.StaffEmail);
            Assert.Equal("123456789", dto.StaffPhoneNumber);
            Assert.Equal("9:00-17:00", dto.StaffAvailabilitySlots);
            Assert.Equal("O20240001@healthcare.com", dto.UserId);
        }


    }
}
