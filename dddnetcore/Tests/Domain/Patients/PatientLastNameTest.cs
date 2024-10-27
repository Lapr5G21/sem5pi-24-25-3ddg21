using System;
using Xunit;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Tests.Domain.Patients
{
    public class PatientLastNameTests
    {
        [Fact]
        public void Constructor_ValidLastName_ShouldSetLastName()
        {
            // Arrange
            string lastName = "Silva";

            // Act
            var patientLastName = new PatientLastName(lastName);

            // Assert
            Assert.Equal(lastName, patientLastName.LastName);
        }

        [Theory]
        [InlineData("")]
        [InlineData("   ")]
        [InlineData(null)]
        public void Constructor_InvalidLastName_ShouldThrowBusinessRuleValidationException(string invalidLastName)
        {
            // Act & Assert
            Assert.Throws<BusinessRuleValidationException>(() => new PatientLastName(invalidLastName));
        }

        [Fact]
        public void Equals_SameLastName_ShouldReturnTrue()
        {
            // Arrange
            var lastName1 = new PatientLastName("Silva");
            var lastName2 = new PatientLastName("Silva");

            // Act
            bool result = lastName1.Equals(lastName2);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void Equals_DifferentLastNames_ShouldReturnFalse()
        {
            // Arrange
            var lastName1 = new PatientLastName("Silva");
            var lastName2 = new PatientLastName("Oliveira");

            // Act
            bool result = lastName1.Equals(lastName2);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void GetHashCode_SameLastName_ShouldReturnSameHashCode()
        {
            // Arrange
            var lastName1 = new PatientLastName("Silva");
            var lastName2 = new PatientLastName("Silva");

            // Act
            int hash1 = lastName1.GetHashCode();
            int hash2 = lastName2.GetHashCode();

            // Assert
            Assert.Equal(hash1, hash2);
        }

        [Fact]
        public void ToString_ShouldReturnLastName()
        {
            // Arrange
            string lastName = "Silva";
            var patientLastName = new PatientLastName(lastName);

            // Act
            string result = patientLastName.ToString();

            // Assert
            Assert.Equal(lastName, result);
        }
    }
}
