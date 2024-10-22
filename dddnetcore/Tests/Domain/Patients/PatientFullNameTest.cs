using Xunit;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Tests.Domain.Patients
{
    public class PatientFullNameTests
    {
        [Fact]
        public void CreatePatientFullName_WithValidName_ShouldCreateSuccessfully()
        {
            // Arrange
            string validName = "John Doe";
            
            // Act
            var fullName = new PatientFullName(validName);
            
            // Assert
            Assert.NotNull(fullName);
            Assert.Equal(validName, fullName.FullName);
        }

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("    ")]
        public void CreatePatientFullName_WithInvalidName_ShouldThrowException(string invalidName)
        {
            // Act & Assert
            var exception = Assert.Throws<BusinessRuleValidationException>(() => new PatientFullName(invalidName));
            Assert.Equal("Name cannot be empty or null.", exception.Message);
        }

        [Fact]
        public void Equals_WithSameFullName_ShouldReturnTrue()
        {
            // Arrange
            string name = "John Doe";
            var fullName1 = new PatientFullName(name);
            var fullName2 = new PatientFullName(name);

            // Act
            bool result = fullName1.Equals(fullName2);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void Equals_WithDifferentFullNames_ShouldReturnFalse()
        {
            // Arrange
            var fullName1 = new PatientFullName("John Doe");
            var fullName2 = new PatientFullName("Jane Doe");

            // Act
            bool result = fullName1.Equals(fullName2);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void ToString_ShouldReturnCorrectStringRepresentation()
        {
            // Arrange
            string validName = "John Doe";
            var fullName = new PatientFullName(validName);

            // Act
            string result = fullName.ToString();

            // Assert
            Assert.Equal(validName, result);
        }

        [Fact]
        public void GetHashCode_ShouldReturnCorrectHashCode()
        {
            // Arrange
            string validName = "John Doe";
            var fullName = new PatientFullName(validName);

            // Act
            int hashCode = fullName.GetHashCode();

            // Assert
            Assert.Equal(validName.GetHashCode(), hashCode);
        }
    }
}
