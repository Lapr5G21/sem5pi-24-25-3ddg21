using Xunit;
using DDDSample1.Domain.Staffs;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Staffs.Tests
{
    public class StaffLastNameTest
    {
        [Fact]
        public void StaffLastNameConstructorWithValidNameTest()
        {
            var lastName = new StaffLastName("Doe");
            Assert.Equal("Doe", lastName.LastNameString);
        }

        [Fact]
        public void StaffLastNameConstructorWithEmptyNameTest()
        {
            Assert.Throws<BusinessRuleValidationException>(() => new StaffLastName(""));
        }

        [Fact]
        public void StaffLastNameConstructorWithNullNameTest()
        {
            Assert.Throws<BusinessRuleValidationException>(() => new StaffLastName(null));
        }

        [Fact]
        public void StaffLastNameEqualsTest()
        {
            var lastName1 = new StaffLastName("Doe");
            var lastName2 = new StaffLastName("Doe");
            var lastName3 = new StaffLastName("Smith");

            Assert.True(lastName1.Equals(lastName2));
            Assert.False(lastName1.Equals(lastName3));
            Assert.False(lastName1.Equals(null));
            Assert.False(lastName1.Equals("Not a StaffLastName"));
        }

        [Fact]
        public void StaffLastNameGetHashCodeTest()
        {
            var lastName1 = new StaffLastName("Doe");
            var lastName2 = new StaffLastName("Doe");
            var lastName3 = new StaffLastName("Smith");

            Assert.Equal(lastName1.GetHashCode(), lastName2.GetHashCode());
            Assert.NotEqual(lastName1.GetHashCode(), lastName3.GetHashCode());
        }

        [Fact]
        public void StaffLastNameToStringTest()
        {
            var lastName = new StaffLastName("Doe");
            Assert.Equal("Doe", lastName.ToString());
        }
    }
}
