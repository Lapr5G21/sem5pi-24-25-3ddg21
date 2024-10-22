using Xunit;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Tests.Domain.Patients
{
    public class PatientBirthDateTests
    {
        [Fact]
        public void CreatePatientBirthDate_WithValidDate_ShouldCreateSuccessfully()
        {
            // Arrange
            string validDate = "1990-01-01";
            
            // Act
            var birthDate = new PatientBirthDate(validDate);
            
            // Assert
            Assert.NotNull(birthDate);
            Assert.Equal(validDate, birthDate.BirthDateString);
        }

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("    ")]
        public void CreatePatientBirthDate_WithInvalidDate_ShouldThrowException(string invalidDate)
        {
            // Act & Assert
            var exception = Assert.Throws<BusinessRuleValidationException>(() => new PatientBirthDate(invalidDate));
            Assert.Equal("Date of Birth cannot be empty.", exception.Message);
        }

        [Fact]
        public void ToString_ShouldReturnCorrectStringRepresentation()
        {
            // Arrange
            string validDate = "1990-01-01";
            var birthDate = new PatientBirthDate(validDate);
            
            // Act
            string result = birthDate.ToString();
            
            // Assert
            Assert.Equal(validDate, result);
        }

        [Fact]
        public void GetHashCode_ShouldReturnCorrectHashCode()
        {
            // Arrange
            string validDate = "1990-01-01";
            var birthDate = new PatientBirthDate(validDate);
            
            // Act
            int hashCode = birthDate.GetHashCode();
            
            // Assert
            Assert.Equal(validDate.GetHashCode(), hashCode);
        }
    }
}
