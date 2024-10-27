using System;
using Xunit;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Tests.Domain.Patients
{
    public class PatientEmergencyContactTests
    {
        [Theory]
        [InlineData("912345678")]
        [InlineData("932345678")]
        [InlineData("962345678")]
        public void Constructor_ValidEmergencyContact_ShouldSetEmergencyContact(string validContact)
        {
            // Act
            var emergencyContact = new PatientEmergencyContact(validContact);

            // Assert
            Assert.Equal(validContact, emergencyContact.EmergencyContact);
        }

        [Theory]
        [InlineData("812345678")]
        [InlineData("123456789")]
        [InlineData("96234")]
        [InlineData("")]
        [InlineData("   ")]
        [InlineData(null)]
        public void Constructor_InvalidEmergencyContact_ShouldThrowArgumentException(string invalidContact)
        {
            // Act & Assert
            Assert.Throws<ArgumentException>(() => new PatientEmergencyContact(invalidContact));
        }

        [Theory]
        [InlineData("912345678", true)]
        [InlineData("932345678", true)]
        [InlineData("962345678", true)]
        [InlineData("812345678", false)]
        [InlineData("123456789", false)]
        [InlineData("96234", false)]
        public void IsValidEmergencyContact_ShouldReturnExpectedResult(string contact, bool expectedResult)
        {
            // Act
            bool result = PatientEmergencyContact.IsValidEmergencyContact(contact);

            // Assert
            Assert.Equal(expectedResult, result);
        }

        [Fact]
        public void ToString_ShouldReturnEmergencyContact()
        {
            // Arrange
            string contact = "912345678";
            var emergencyContact = new PatientEmergencyContact(contact);

            // Act
            string result = emergencyContact.ToString();

            // Assert
            Assert.Equal(contact, result);
        }
    }
}
