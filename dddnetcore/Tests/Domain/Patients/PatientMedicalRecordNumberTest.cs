using System;
using Xunit;
using DDDSample1.Domain.Patients;

namespace DDDSample1.Tests.Domain.Patients
{
    public class PatientMedicalRecordNumberTests
    {
<<<<<<< HEAD
=======
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

>>>>>>> 3cc4922d05178fabfdd32f3037ed0efbcc05ca24
        [Fact]
        public void Constructor_ValidMedicalRecordNumber_ShouldCreateInstance()
        {
            string validNumber = "202301000001";

            var recordNumber = new PatientMedicalRecordNumber(validNumber);

            Assert.Equal(validNumber, recordNumber.AsString());
        }
        [Fact]
        public void Constructor_InvalidMedicalRecordNumber_ShouldThrowArgumentException_WhenWhitespace()
        {
            Assert.Throws<ArgumentException>(() => new PatientMedicalRecordNumber("  "));
        }

        [Theory]
        [InlineData("202301000001")] 
        [InlineData("202302000002")] 
        public void AsString_ValidMedicalRecordNumber_ShouldReturnCorrectString(string validNumber)
        {
            var recordNumber = new PatientMedicalRecordNumber(validNumber);

            string result = recordNumber.AsString();

            Assert.Equal(validNumber, result);
        }

        [Fact]
        public void GenerateNewRecordNumber_ShouldReturnCorrectFormat()
        {
            DateTime registrationDate = new DateTime(2023, 01, 15);
            int sequentialNumber = 1;

            string result = PatientMedicalRecordNumber.GenerateNewRecordNumber(registrationDate, sequentialNumber);

            Assert.Equal("202301000001", result);
        }

        [Fact]
        public void GenerateNewRecordNumber_ShouldReturnCorrectFormat_UsingDifferentSequentialNumber()
        {
            DateTime registrationDate = new DateTime(2023, 02, 25);
            int sequentialNumber = 123;

            string result = PatientMedicalRecordNumber.GenerateNewRecordNumber(registrationDate, sequentialNumber);

            Assert.Equal("202302000123", result); 
        }
    }
}
