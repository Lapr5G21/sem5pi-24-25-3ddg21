using System;
using Xunit;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Tests.Domain.Patients
{
    public class PatientFullNameTests
    {
        [Fact]
        public void Constructor_ValidFullName_ShouldSetFullName()
        {
            // Arrange
            string fullName = "Vasco Teixeira";

            // Act
            var patientFullName = new PatientFullName(fullName);

            // Assert
            Assert.Equal(fullName, patientFullName.FullName);
        }

        [Theory]
        [InlineData("")]
        [InlineData("   ")]
        [InlineData(null)]
        public void Constructor_InvalidFullName_ShouldThrowBusinessRuleValidationException(string invalidFullName)
        {
            // Act & Assert
            Assert.Throws<BusinessRuleValidationException>(() => new PatientFullName(invalidFullName));
        }

        [Fact]
        public void Equals_SameFullName_ShouldReturnTrue()
        {
            // Arrange
            var fullName1 = new PatientFullName("Vasco Teixeira");
            var fullName2 = new PatientFullName("Vasco Teixeira");

            // Act
            bool result = fullName1.Equals(fullName2);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void Equals_DifferentFullNames_ShouldReturnFalse()
        {
            // Arrange
            var fullName1 = new PatientFullName("Vasco Teixeira");
            var fullName2 = new PatientFullName("Bruno Ribeiro");

            // Act
            bool result = fullName1.Equals(fullName2);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void GetHashCode_SameFullName_ShouldReturnSameHashCode()
        {
            // Arrange
            var fullName1 = new PatientFullName("Vasco Teixeira");
            var fullName2 = new PatientFullName("Vasco Teixeira");

            // Act
            int hash1 = fullName1.GetHashCode();
            int hash2 = fullName2.GetHashCode();

            // Assert
            Assert.Equal(hash1, hash2);
        }

        [Fact]
        public void ToString_ShouldReturnFullName()
        {
            // Arrange
            string fullName = "Vasco Teixeira";
            var patientFullName = new PatientFullName(fullName);

            // Act
            string result = patientFullName.ToString();

            // Assert
            Assert.Equal(fullName, result);
        }
    }
}
