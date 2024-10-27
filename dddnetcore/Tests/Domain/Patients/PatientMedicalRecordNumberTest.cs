using System;
using Xunit;
using DDDSample1.Domain.Patients;

namespace DDDSample1.Tests.Domain.Patients
{
    public class PatientMedicalRecordNumberTests
    {
        [Theory]
        [InlineData("202312000001")] // Formato válido
        [InlineData("202212999999")] // Formato válido com mês e sequencial limite
        public void Constructor_ValidMedicalRecordNumber_ShouldCreateInstance(string validRecordNumber)
        {
            // Act
            var recordNumber = new PatientMedicalRecordNumber(validRecordNumber);

            // Assert
            Assert.Equal(validRecordNumber, recordNumber.AsString());
        }

        [Theory]
        [InlineData("202313000001")] // Mês inválido (13)
        [InlineData("123")]          // Tamanho incorreto
        [InlineData("abcdefabcdef")]  // Caracteres não numéricos
        [InlineData("")]              // String vazia
        [InlineData(null)]            // Valor nulo
        public void Constructor_InvalidMedicalRecordNumber_ShouldThrowArgumentException(string invalidRecordNumber)
        {
            // Act & Assert
            Assert.Throws<ArgumentException>(() => new PatientMedicalRecordNumber(invalidRecordNumber));
        }

        [Theory]
        [InlineData("202312000001")] // Formato válido
        [InlineData("202201123456")] // Formato válido
        public void IsValidFormat_ValidFormat_ShouldReturnTrue(string validFormat)
        {
            // Arrange
            var recordNumber = new PatientMedicalRecordNumber(validFormat);

            // Act
            bool result = recordNumber.AsString() == validFormat;

            // Assert
            Assert.True(result);
        }

        [Theory]
        [InlineData("202313000001")] // Mês inválido
        [InlineData("abcdefghijk")]   // Caracteres não numéricos
        [InlineData("2022")]          // Tamanho incorreto
        public void IsValidFormat_InvalidFormat_ShouldReturnFalse(string invalidFormat)
        {
            // Arrange
            bool result = PatientMedicalRecordNumber.IsValid(invalidFormat);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void GenerateNewRecordNumber_ValidDateAndSequence_ShouldReturnCorrectFormat()
        {
            // Arrange
            DateTime registrationDate = new DateTime(2023, 12, 01);
            int sequentialNumber = 123;

            // Act
            string generatedRecordNumber = PatientMedicalRecordNumber.GenerateNewRecordNumber(registrationDate, sequentialNumber);

            // Assert
            Assert.Equal("202312000123", generatedRecordNumber);
        }

        [Fact]
        public void AsString_ShouldReturnMedicalRecordNumberAsString()
        {
            // Arrange
            string validRecordNumber = "202312000001";
            var recordNumber = new PatientMedicalRecordNumber(validRecordNumber);

            // Act
            string result = recordNumber.AsString();

            // Assert
            Assert.Equal(validRecordNumber, result);
        }
    }
}
