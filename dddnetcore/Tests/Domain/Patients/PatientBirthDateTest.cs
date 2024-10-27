using System;
using Xunit;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Tests.Domain.Patients
{
    public class PatientBirthDateTests
    {
        [Theory]
        [InlineData("2000-01-01")]
        [InlineData("1990-12-31")]
        [InlineData("1985-06-15")]
        public void Constructor_ValidBirthDate_ShouldSetBirthDateString(string validDate)
        {
            // Act
            var birthDate = new PatientBirthDate(validDate);

            // Assert
            Assert.Equal(validDate, birthDate.BirthDateString);
        }

        [Theory]
        [InlineData("")]
        [InlineData("   ")]
        [InlineData(null)]
        public void Constructor_EmptyOrNullDate_ShouldThrowBusinessRuleValidationException(string invalidDate)
        {
            // Act & Assert
            Assert.Throws<BusinessRuleValidationException>(() => new PatientBirthDate(invalidDate));
        }

        [Fact]
        public void GetHashCode_ShouldReturnHashCodeOfBirthDateString()
        {
            // Arrange
            string date = "2000-01-01";
            var birthDate = new PatientBirthDate(date);

            // Act
            int hashCode = birthDate.GetHashCode();

            // Assert
            Assert.Equal(date.GetHashCode(), hashCode);
        }

        [Fact]
        public void ToString_ShouldReturnBirthDateString()
        {
            // Arrange
            string date = "2000-01-01";
            var birthDate = new PatientBirthDate(date);

            // Act
            string result = birthDate.ToString();

            // Assert
            Assert.Equal(date, result);
        }
    }
}
