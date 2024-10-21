using Xunit;
using DDDSample1.Domain.Staffs;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Staffs.Tests
{
    public class StaffFirstNameTest
    {
        [Fact]
        public void StaffFirstNameConstructorWithValidNameTest()
        {
            var firstName = new StaffFirstName("John");
            Assert.Equal("John", firstName.FirstNameString);
        }

        [Fact]
        public void StaffFirstNameConstructorWithEmptyNameTest()
        {
            Assert.Throws<BusinessRuleValidationException>(() => new StaffFirstName(""));
        }

        [Fact]
        public void StaffFirstNameConstructorWithNullNameTest()
        {
            Assert.Throws<BusinessRuleValidationException>(() => new StaffFirstName(null));
        }

        [Fact]
        public void StaffFirstNameEqualsTest()
        {
            var firstName1 = new StaffFirstName("John");
            var firstName2 = new StaffFirstName("John");
            var firstName3 = new StaffFirstName("Doe");

            Assert.True(firstName1.Equals(firstName2));
            Assert.False(firstName1.Equals(firstName3));
            Assert.False(firstName1.Equals(null));
            Assert.False(firstName1.Equals("Not a StaffFirstName"));
        }

        [Fact]
        public void StaffFirstNameGetHashCodeTest()
        {
            var firstName1 = new StaffFirstName("John");
            var firstName2 = new StaffFirstName("John");
            var firstName3 = new StaffFirstName("Doe");

            Assert.Equal(firstName1.GetHashCode(), firstName2.GetHashCode());
            Assert.NotEqual(firstName1.GetHashCode(), firstName3.GetHashCode());
        }

        [Fact]
        public void StaffFirstNameToStringTest()
        {
            var firstName = new StaffFirstName("John");
            Assert.Equal("John", firstName.ToString());
        }
    }
}
