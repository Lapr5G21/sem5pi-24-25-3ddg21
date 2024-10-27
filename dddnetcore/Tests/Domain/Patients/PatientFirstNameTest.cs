using System;
using Xunit;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Tests.Domain.Patients
{
    public class PatientFirstNameTests
    {
        [Fact]
        public void Constructor_ValidFirstName_ShouldSetFirstName()
        {
            // Arrange
            string firstName = "Vasco";

            // Act
            var patientFirstName = new PatientFirstName(firstName);

            // Assert
            Assert.Equal(firstName, patientFirstName.FirstName);
        }

        [Theory]
        [InlineData("")]
        [InlineData("   ")]
        [InlineData(null)]
        public void Constructor_InvalidFirstName_ShouldThrowBusinessRuleValidationException(string invalidFirstName)
        {
            // Act & Assert
            Assert.Throws<BusinessRuleValidationException>(() => new PatientFirstName(invalidFirstName));
        }

        [Fact]
        public void Equals_SameFirstName_ShouldReturnTrue()
        {
            // Arrange
            var firstName1 = new PatientFirstName("Vasco");
            var firstName2 = new PatientFirstName("Vasco");

            // Act
            bool result = firstName1.Equals(firstName2);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void Equals_DifferentFirstNames_ShouldReturnFalse()
        {
            // Arrange
            var firstName1 = new PatientFirstName("Vasco");
            var firstName2 = new PatientFirstName("Bruno");

            // Act
            bool result = firstName1.Equals(firstName2);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void GetHashCode_SameFirstName_ShouldReturnSameHashCode()
        {
            // Arrange
            var firstName1 = new PatientFirstName("Vasco");
            var firstName2 = new PatientFirstName("Vasco");

            // Act
            int hash1 = firstName1.GetHashCode();
            int hash2 = firstName2.GetHashCode();

            // Assert
            Assert.Equal(hash1, hash2);
        }

        [Fact]
        public void ToString_ShouldReturnFirstName()
        {
            // Arrange
            string firstName = "Vasco";
            var patientFirstName = new PatientFirstName(firstName);

            // Act
            string result = patientFirstName.ToString();

            // Assert
            Assert.Equal(firstName, result);
        }
    }
}
