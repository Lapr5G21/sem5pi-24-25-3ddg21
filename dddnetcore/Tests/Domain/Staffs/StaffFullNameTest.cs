using Xunit;
using DDDSample1.Domain.Staffs;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Staffs.Tests
{
    public class StaffFullNameTest
    {
        [Fact]
        public void StaffFullNameConstructorWithValidNameTest()
        {
            var fullName = new StaffFullName("Joao Oliveira");
            Assert.Equal("Joao Oliveira", fullName.FullNameString);
        }

        [Fact]
        public void StaffFullNameConstructorWithEmptyNameTest()
        {
            Assert.Throws<BusinessRuleValidationException>(() => new StaffFullName(""));
        }

        [Fact]
        public void StaffFullNameConstructorWithNullNameTest()
        {
            Assert.Throws<BusinessRuleValidationException>(() => new StaffFullName(null));
        }

        [Fact]
        public void StaffFullNameEqualsTest()
        {
            var fullName1 = new StaffFullName("Joao Oliveira");
            var fullName2 = new StaffFullName("Joao Oliveira");
            var fullName3 = new StaffFullName("Bruno Oliveira");

            Assert.True(fullName1.Equals(fullName2));
            Assert.False(fullName1.Equals(fullName3));
            Assert.False(fullName1.Equals(null));
            Assert.False(fullName1.Equals("Not a StaffFullName"));
        }

        [Fact]
        public void StaffFullNameGetHashCodeTest()
        {
            var fullName1 = new StaffFullName("Joao Oliveira");
            var fullName2 = new StaffFullName("Joao Oliveira");
            var fullName3 = new StaffFullName("Bruno Oliveira");

            Assert.Equal(fullName1.GetHashCode(), fullName2.GetHashCode());
            Assert.NotEqual(fullName1.GetHashCode(), fullName3.GetHashCode());
        }

        [Fact]
        public void StaffFullNameToStringTest()
        {
            var fullName = new StaffFullName("Joao Oliveira");
            Assert.Equal("Joao Oliveira", fullName.ToString());
        }
    }
}
