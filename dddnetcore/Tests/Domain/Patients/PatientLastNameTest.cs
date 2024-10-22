using Xunit;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Tests.Domain.Patients
{
    public class PatientLastNameTests
    {
        [Fact]
        public void CreatePatientLastName_WithValidName_ShouldCreateSuccessfully()
        {
            // Arrange
            string validName = "Doe";
            
            // Act
            var lastName = new PatientLastName(validName);
            
            // Assert
            Assert.NotNull(lastName);
            Assert.Equal(validName, lastName.LastName);
        }

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("    ")]
        public void CreatePatientLastName_WithInvalidName_ShouldThrowException(string invalidName)
        {
            // Act & Assert
            var exception = Assert.Throws<BusinessRuleValidationException>(() => new PatientLastName(invalidName));
            Assert.Equal("Name cannot be empty or null.", exception.Message);
        }

        [Fact]
        public void Equals_WithSameLastName_ShouldReturnTrue()
        {
            // Arrange
            string name = "Doe";
            var lastName1 = new PatientLastName(name);
            var lastName2 = new PatientLastName(name);

            // Act
            bool result = lastName1.Equals(lastName2);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void Equals_WithDifferentLastNames_ShouldReturnFalse()
        {
            // Arrange
            var lastName1 = new PatientLastName("Doe");
            var lastName2 = new PatientLastName("Smith");

            // Act
            bool result = lastName1.Equals(lastName2);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void ToString_ShouldReturnCorrectStringRepresentation()
        {
            // Arrange
            string validName = "Doe";
            var lastName = new PatientLastName(validName);

            // Act
            string result = lastName.ToString();

            // Assert
            Assert.Equal(validName, result);
        }

        [Fact]
        public void GetHashCode_ShouldReturnCorrectHashCode()
        {
            // Arrange
            string validName = "Doe";
            var lastName = new PatientLastName(validName);

            // Act
            int hashCode = lastName.GetHashCode();

            // Assert
            Assert.Equal(validName.GetHashCode(), hashCode);
        }
    }
}
