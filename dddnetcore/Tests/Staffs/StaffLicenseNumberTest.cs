using Xunit;
using DDDSample1.Domain.Staffs;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Staffs.Tests
{
    public class StaffLicenseNumberTest
    {
        [Fact]
        public void StaffLicenseNumberConstructorWithValidValueTest()
        {
            var licenseNumber = new StaffLicenseNumber("ABC123");
            Assert.Equal("ABC123", licenseNumber.LicenseNumberString);
        }

        [Fact]
        public void StaffLicenseNumberConstructorWithEmptyValueTest()
        {
            Assert.Throws<BusinessRuleValidationException>(() => new StaffLicenseNumber(""));
        }

        [Fact]
        public void StaffLicenseNumberConstructorWithNullValueTest()
        {
            Assert.Throws<BusinessRuleValidationException>(() => new StaffLicenseNumber(null));
        }

        [Fact]
        public void StaffLicenseNumberEqualsTest()
        {
            var licenseNumber1 = new StaffLicenseNumber("ABC123");
            var licenseNumber2 = new StaffLicenseNumber("ABC123");
            var licenseNumber3 = new StaffLicenseNumber("XYZ456");

            Assert.True(licenseNumber1.Equals(licenseNumber2));
            Assert.False(licenseNumber1.Equals(licenseNumber3));
            Assert.False(licenseNumber1.Equals(null));
            Assert.False(licenseNumber1.Equals("Not a StaffLicenseNumber"));
        }

        [Fact]
        public void StaffLicenseNumberGetHashCodeTest()
        {
            var licenseNumber1 = new StaffLicenseNumber("ABC123");
            var licenseNumber2 = new StaffLicenseNumber("ABC123");
            var licenseNumber3 = new StaffLicenseNumber("XYZ456");

            Assert.Equal(licenseNumber1.GetHashCode(), licenseNumber2.GetHashCode());
            Assert.NotEqual(licenseNumber1.GetHashCode(), licenseNumber3.GetHashCode());
        }

        [Fact]
        public void StaffLicenseNumberToStringTest()
        {
            var licenseNumber = new StaffLicenseNumber("ABC123");
            Assert.Equal("ABC123", licenseNumber.ToString());
        }
    }
}
