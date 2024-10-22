using Xunit;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Tests.Domain.Patients
{
    public class PatientFirstNameTests
    {
        [Fact]
        public void CreatePatientFirstName_WithValidName_ShouldCreateSuccessfully()
        {
            // Arrange
            string validName = "John";
            
            // Act
            var firstName = new PatientFirstName(validName);
            
            // Assert
            Assert.NotNull(firstName);
            Assert.Equal(validName, firstName.FirstName);
        }

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("    ")]
        public void CreatePatientFirstName_WithInvalidName_ShouldThrowException(string invalidName)
        {
            // Act & Assert
            var exception = Assert.Throws<BusinessRuleValidationException>(() => new PatientFirstName(invalidName));
            Assert.Equal("Name cannot be empty or null.", exception.Message);
        }

        [Fact]
        public void Equals_WithSameName_ShouldReturnTrue()
        {
            // Arrange
            string name = "John";
            var firstName1 = new PatientFirstName(name);
            var firstName2 = new PatientFirstName(name);

            // Act
            bool result = firstName1.Equals(firstName2);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void Equals_WithDifferentNames_ShouldReturnFalse()
        {
            // Arrange
            var firstName1 = new PatientFirstName("John");
            var firstName2 = new PatientFirstName("Jane");

            // Act
            bool result = firstName1.Equals(firstName2);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void ToString_ShouldReturnCorrectStringRepresentation()
        {
            // Arrange
            string validName = "John";
            var firstName = new PatientFirstName(validName);

            // Act
            string result = firstName.ToString();

            // Assert
            Assert.Equal(validName, result);
        }

        [Fact]
        public void GetHashCode_ShouldReturnCorrectHashCode()
        {
            // Arrange
            string validName = "John";
            var firstName = new PatientFirstName(validName);

            // Act
            int hashCode = firstName.GetHashCode();

            // Assert
            Assert.Equal(validName.GetHashCode(), hashCode);
        }
    }
}
