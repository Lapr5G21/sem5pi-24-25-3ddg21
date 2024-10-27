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
            var firstName = new StaffFirstName("Joao");
            Assert.Equal("Joao", firstName.FirstNameString);
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
            var firstName1 = new StaffFirstName("Joao");
            var firstName2 = new StaffFirstName("Joao");
            var firstName3 = new StaffFirstName("Oliveira");

            Assert.True(firstName1.Equals(firstName2));
            Assert.False(firstName1.Equals(firstName3));
            Assert.False(firstName1.Equals(null));
            Assert.False(firstName1.Equals("Not a StaffFirstName"));
        }

        [Fact]
        public void StaffFirstNameGetHashCodeTest()
        {
            var firstName1 = new StaffFirstName("Joao");
            var firstName2 = new StaffFirstName("Joao");
            var firstName3 = new StaffFirstName("Oliveira");

            Assert.Equal(firstName1.GetHashCode(), firstName2.GetHashCode());
            Assert.NotEqual(firstName1.GetHashCode(), firstName3.GetHashCode());
        }

        [Fact]
        public void StaffFirstNameToStringTest()
        {
            var firstName = new StaffFirstName("Joao");
            Assert.Equal("Joao", firstName.ToString());
        }
    }
}
