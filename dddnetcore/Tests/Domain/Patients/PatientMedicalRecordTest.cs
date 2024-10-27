using System;
using Xunit;
using DDDSample1.Domain.Patients;

namespace DDDSample1.Tests.Domain.Patients
{
    public class PatientMedicalRecordTests
    {
        [Fact]
        public void Constructor_ShouldSetMedicalRecord()
        {
            // Arrange
            string medicalRecord = "asthma and severe constipation";

            // Act
            var record = new PatientMedicalRecord(medicalRecord);

            // Assert
            Assert.Equal(medicalRecord, record.MedicalRecord);
        }

        [Fact]
        public void Equals_SameMedicalRecord_ShouldReturnTrue()
        {
            // Arrange
            var record1 = new PatientMedicalRecord("asthma and severe constipation");
            var record2 = new PatientMedicalRecord("asthma and severe constipation");

            // Act
            bool result = record1.Equals(record2);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void Equals_DifferentMedicalRecords_ShouldReturnFalse()
        {
            // Arrange
            var record1 = new PatientMedicalRecord("asthma and severe constipation");
            var record2 = new PatientMedicalRecord("asthma");

            // Act
            bool result = record1.Equals(record2);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void GetHashCode_SameMedicalRecord_ShouldReturnSameHashCode()
        {
            // Arrange
            var record1 = new PatientMedicalRecord("asthma");
            var record2 = new PatientMedicalRecord("asthma");

            // Act
            int hash1 = record1.GetHashCode();
            int hash2 = record2.GetHashCode();

            // Assert
            Assert.Equal(hash1, hash2);
        }

        [Fact]
        public void ToString_ShouldReturnMedicalRecord()
        {
            // Arrange
            string medicalRecord = "asthma";
            var record = new PatientMedicalRecord(medicalRecord);

            // Act
            string result = record.ToString();

            // Assert
            Assert.Equal(medicalRecord, result);
        }

        [Fact]
        public void Constructor_NullMedicalRecord_ShouldAllowEmpty()
        {
            // Act
            var record = new PatientMedicalRecord(null);

            // Assert
            Assert.Null(record.MedicalRecord);
        }
    }
}
