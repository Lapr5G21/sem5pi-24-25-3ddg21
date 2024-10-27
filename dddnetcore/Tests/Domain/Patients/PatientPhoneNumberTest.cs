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

        [Theory]
        [InlineData("123456789")] // Não começa com '9'
        [InlineData("91234567")]  // Número com 8 dígitos
        [InlineData("9999999999")] // Número com mais de 9 dígitos
        [InlineData("abcdefghi")]  // Caracteres inválidos
        [InlineData("")]           // String vazia
        [InlineData(null)]         // Valor nulo
        public void Constructor_InvalidPhoneNumber_ShouldThrowArgumentException(string invalidPhoneNumber)
        {
            // Act & Assert
            Assert.Throws<ArgumentException>(() => new PatientPhoneNumber(invalidPhoneNumber));
        }

        [Theory]
        [InlineData("912345678")] // Válido: Começa com '9' e tem 9 dígitos
        [InlineData("923456789")] // Válido: Começa com '9' e tem 9 dígitos
        [InlineData("936123456")] // Válido: Começa com '9' e tem 9 dígitos
        [InlineData("963456789")] // Válido: Começa com '9' e tem 9 dígitos
        public void IsValidPhoneNumber_ValidInput_ShouldReturnTrue(string validPhoneNumber)
        {
            // Act
            bool result = PatientPhoneNumber.IsValidPhoneNumber(validPhoneNumber);

            // Assert
            Assert.True(result);
        }

        [Theory]
        [InlineData("123456789")] // Inválido: Não começa com '9'
        [InlineData("91234567")]  // Inválido: Menos de 9 dígitos
        [InlineData("9123456789")] // Inválido: Mais de 9 dígitos
        [InlineData("abcdefgh")]   // Inválido: Caracteres alfabéticos
        public void IsValidPhoneNumber_InvalidInput_ShouldReturnFalse(string invalidPhoneNumber)
        {
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
