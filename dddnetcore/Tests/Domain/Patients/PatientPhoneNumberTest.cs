using System;
using Xunit;
using DDDSample1.Domain.Patients;

namespace DDDSample1.Tests.Domain.Patients
{
    public class PatientPhoneNumberTests
    {
        [Fact]
        public void Constructor_ValidPhoneNumber_ShouldCreateInstance()
        {
            // Arrange
            string validPhoneNumber = "912345678";

            // Act
            var phoneNumber = new PatientPhoneNumber(validPhoneNumber);

            // Assert
            Assert.Equal(validPhoneNumber, phoneNumber.PhoneNumber);
        }

<<<<<<< HEAD
        [Fact]
        public void Constructor_InvalidPhoneNumber_ShouldThrowArgumentException_WhenTooShort()
        {
            // Arrange
            string invalidPhoneNumber = "91234567"; // Less than 9 digits

            // Act & Assert
            Assert.Throws<ArgumentException>(() => new PatientPhoneNumber(invalidPhoneNumber));
        }
=======
>>>>>>> 3cc4922d05178fabfdd32f3037ed0efbcc05ca24

        [Fact]
        public void Constructor_InvalidPhoneNumber_ShouldThrowArgumentException_WhenTooLong()
        {
            // Arrange
            string invalidPhoneNumber = "9999999999"; // More than 9 digits

            // Act & Assert
            Assert.Throws<ArgumentException>(() => new PatientPhoneNumber(invalidPhoneNumber));
        }

        [Fact]
        public void Constructor_InvalidPhoneNumber_ShouldThrowArgumentException_WhenAlphabetic()
        {
            // Arrange
            string invalidPhoneNumber = "abcdefghi"; // Contains letters

            // Act & Assert
            Assert.Throws<ArgumentException>(() => new PatientPhoneNumber(invalidPhoneNumber));
        }

        [Fact]
        public void Constructor_InvalidPhoneNumber_ShouldThrowArgumentException_WhenEmpty()
        {
            // Arrange
            string invalidPhoneNumber = ""; // Empty string

            // Act & Assert
            Assert.Throws<ArgumentException>(() => new PatientPhoneNumber(invalidPhoneNumber));
        }

        [Fact]
        public void IsValidPhoneNumber_ValidPhoneNumber_ShouldReturnTrue_WhenStartsWithNine()
        {
            // Arrange
            string validPhoneNumber = "912345678"; // Starts with '9' and has 9 digits

            // Act
            bool result = PatientPhoneNumber.IsValidPhoneNumber(validPhoneNumber);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void IsValidPhoneNumber_ValidPhoneNumber_ShouldReturnTrue_WhenStartsWithNineAlternate()
        {
            // Arrange
            string validPhoneNumber = "923456789"; // Another valid number

            // Act
            bool result = PatientPhoneNumber.IsValidPhoneNumber(validPhoneNumber);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void IsValidPhoneNumber_InvalidPhoneNumber_ShouldReturnFalse_WhenDoesNotStartWithNine()
        {
            // Arrange
            string invalidPhoneNumber = "123456789"; // Does not start with '9'

            // Act
            bool result = PatientPhoneNumber.IsValidPhoneNumber(invalidPhoneNumber);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void IsValidPhoneNumber_InvalidPhoneNumber_ShouldReturnFalse_WhenLessThanNineDigits()
        {
            // Arrange
            string invalidPhoneNumber = "91234567"; // Less than 9 digits

            // Act
            bool result = PatientPhoneNumber.IsValidPhoneNumber(invalidPhoneNumber);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void IsValidPhoneNumber_InvalidPhoneNumber_ShouldReturnFalse_WhenMoreThanNineDigits()
        {
            // Arrange
            string invalidPhoneNumber = "9123456789"; // More than 9 digits

            // Act
            bool result = PatientPhoneNumber.IsValidPhoneNumber(invalidPhoneNumber);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void IsValidPhoneNumber_InvalidPhoneNumber_ShouldReturnFalse_WhenContainsAlphabeticCharacters()
        {
            // Arrange
            string invalidPhoneNumber = "abcdefgh"; // Contains letters

            // Act
            bool result = PatientPhoneNumber.IsValidPhoneNumber(invalidPhoneNumber);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void ToString_ShouldReturnPhoneNumberAsString()
        {
            // Arrange
            string phoneNumberStr = "912345678";
            var phoneNumber = new PatientPhoneNumber(phoneNumberStr);

            // Act
            string result = phoneNumber.ToString();

            // Assert
            Assert.Equal(phoneNumberStr, result);
        }
    }
}
