using System;
using Xunit;
using DDDSample1.Domain.Patients;

namespace DDDSample1.Tests.Domain.Patients
{
    public class PatientMedicalRecordNumberTests
    {
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
