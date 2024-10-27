using System;
using Xunit;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Tests.Domain.Patients
{
    public class PatientEmailTests
    {
        [Theory]
        [InlineData("example@example.com")]
        [InlineData("user.name+tag+sorting@example.com")]
        [InlineData("user_name@domain.co")]
        public void Constructor_ValidEmail_ShouldSetEmailString(string validEmail)
        {
            // Act
            var email = new PatientEmail(validEmail);

            // Assert
            Assert.Equal(validEmail, email.EmailString);
        }

        [Theory]
        [InlineData("")]
        [InlineData("   ")]
        [InlineData(null)]
        public void Constructor_EmptyOrNullEmail_ShouldThrowBusinessRuleValidationException(string invalidEmail)
        {
            // Act & Assert
            Assert.Throws<BusinessRuleValidationException>(() => new PatientEmail(invalidEmail));
        }

        [Theory]
        [InlineData("plainaddress")]
        [InlineData("missingatsign.com")]
        [InlineData("missing@dot@domain.com")]
        public void Constructor_InvalidEmailFormat_ShouldThrowBusinessRuleValidationException(string invalidEmail)
        {
            // Act & Assert
            Assert.Throws<BusinessRuleValidationException>(() => new PatientEmail(invalidEmail));
        }

        [Theory]
        [InlineData("example@example.com", true)]
        [InlineData("user@domain.com", true)]
        [InlineData("plainaddress", false)]
        [InlineData("missingatsign.com", false)]
        public void IsValidEmail_ShouldReturnExpectedResult(string email, bool expectedResult)
        {
            // Arrange
            var patientEmail = new PatientEmail("test@valid.com");

            // Act
            bool result = patientEmail.IsValidEmail(email);

            // Assert
            Assert.Equal(expectedResult, result);
        }

        [Fact]
        public void ToString_ShouldReturnEmailString()
        {
            // Arrange
            string emailString = "example@example.com";
            var email = new PatientEmail(emailString);

            // Act
            string result = email.ToString();

            // Assert
            Assert.Equal(emailString, result);
        }
    }
}
