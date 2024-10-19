using Xunit;
using DDDSample1.Domain.Staffs;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Staffs.Tests
{
    public class StaffEmailTest
    {
        [Fact]
        public void StaffEmailConstructorValidEmailTest()
        {
            var email = "user@example.com";
            var staffEmail = new StaffEmail(email);
            Assert.Equal(email, staffEmail.ToString());
        }

        [Fact]
        public void StaffEmailConstructorEmptyEmailTest()
        {
            Assert.Throws<BusinessRuleValidationException>(() => new StaffEmail(string.Empty));
        }

        [Fact]
        public void StaffEmailConstructorNullEmailTest()
        {
            Assert.Throws<BusinessRuleValidationException>(() => new StaffEmail(null));
        }

        [Fact]
        public void StaffEmailConstructorInvalidEmailFormatTest()
        {
            Assert.Throws<BusinessRuleValidationException>(() => new StaffEmail("invalid-email"));
        }

        [Fact]
        public void StaffEmailConstructorValidEmailWithSpaceTest()
        {
            var email = " user@example.com ";
            var staffEmail = new StaffEmail(email.Trim());
            Assert.Equal(email.Trim(), staffEmail.ToString());
        }

        [Fact]
        public void StaffEmailToStringTest()
        {
            var email = "user@example.com";
            var staffEmail = new StaffEmail(email);
            Assert.Equal(email, staffEmail.ToString());
        }
    }
}
