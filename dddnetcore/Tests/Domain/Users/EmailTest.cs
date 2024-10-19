using System;
using Xunit;
using DDDSample1.Domain.Users;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Tests.Domain.Users
{
    public class EmailTest
    {
        [Fact]
        public void CreateValidEmailTest()
        {
            var email = new Email("test@example.com");
            Assert.Equal("test@example.com", email.ToString());
        }

        [Fact]
        public void CreateInvalidEmailTest()
        {
            Assert.Throws<BusinessRuleValidationException>(() => new Email(string.Empty));
            Assert.Throws<BusinessRuleValidationException>(() => new Email("invalid-email"));
        }
    }
}
