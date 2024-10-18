using Moq;
using System;
using Xunit;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Patients;

namespace DDDSample1.Tests.Domain.Patients
{
    public class PatientTest
    {
        [Fact]
        public void CreatePatient_ValidData_ShouldCreatePatient()
        {
            // Arrange
            var firstName = new Mock<PatientFirstName>().Object;
            var lastName = new Mock<PatientLastName>().Object;
            var fullName = new Mock<PatientFullName>().Object;
            var birthDate = new Mock<PatientBirthDate>().Object;
            var gender = new Mock<PatientGender>().Object;
            var medicalRecordNumber = new Mock<PatientMedicalRecordNumber>().Object;
            var contactInfo = new Mock<PatientContactInformation>().Object;
            var emergencyContact = new Mock<PatientEmergencyContact>().Object;

            // Act
            var patient = new Patient(firstName, lastName, fullName, birthDate, gender, medicalRecordNumber, contactInfo, emergencyContact);

            // Assert
            Assert.Equal(firstName, patient.FirstName);
            Assert.Equal(lastName, patient.LastName);
            Assert.Equal(fullName, patient.FullName);
            Assert.Equal(birthDate, patient.BirthDate);
            Assert.Equal(gender, patient.Gender);
            Assert.Equal(medicalRecordNumber, patient.MedicalRecordNumber);
            Assert.Equal(contactInfo, patient.ContactInformation);
            Assert.Equal(emergencyContact, patient.EmergencyContact);
            Assert.True(patient.Active);
        }

        [Fact]
        public void ChangeName_ValidName_ShouldChangeFullName()
        {
            // Arrange
            var fullName = new Mock<PatientFullName>().Object;
            var patient = CreateValidPatient();

            // Act
            patient.ChangeName(fullName);

            // Assert
            Assert.Equal(fullName, patient.FullName);
        }

        [Fact]
        public void ChangeName_NullName_ShouldThrowArgumentNullException()
        {
            // Arrange
            var patient = CreateValidPatient();

            // Act & Assert
            Assert.Throws<ArgumentNullException>(() => patient.ChangeName(null));
        }

        [Fact]
        public void ChangeBirthDate_ValidBirthDate_ShouldChangeBirthDate()
        {
            // Arrange
            var newBirthDate = new Mock<PatientBirthDate>().Object;
            var patient = CreateValidPatient();

            // Act
            patient.ChangeBirthDate(newBirthDate);

            // Assert
            Assert.Equal(newBirthDate, patient.BirthDate);
        }

        [Fact]
        public void ChangeBirthDate_NullBirthDate_ShouldThrowArgumentNullException()
        {
            // Arrange
            var patient = CreateValidPatient();

            // Act & Assert
            Assert.Throws<ArgumentNullException>(() => patient.ChangeBirthDate(null));
        }

        [Fact]
        public void ChangeGender_ValidGender_ShouldChangeGender()
        {
            // Arrange
            var newGender = new Mock<PatientGender>().Object;
            var patient = CreateValidPatient();

            // Act
            patient.ChangeGender(newGender);

            // Assert
            Assert.Equal(newGender, patient.Gender);
        }

        [Fact]
        public void ChangeGender_NullGender_ShouldThrowArgumentNullException()
        {
            // Arrange
            var patient = CreateValidPatient();

            // Act & Assert
            Assert.Throws<ArgumentNullException>(() => patient.ChangeGender(null));
        }

        [Fact]
        public void ChangeMedicalRecordNumber_ValidRecordNumber_ShouldChangeMedicalRecordNumber()
        {
            // Arrange
            var newMedicalRecordNumber = new Mock<PatientMedicalRecordNumber>().Object;
            var patient = CreateValidPatient();

            // Act
            patient.ChangeMedicalRecordNumber(newMedicalRecordNumber);

            // Assert
            Assert.Equal(newMedicalRecordNumber, patient.MedicalRecordNumber);
        }

        [Fact]
        public void ChangeMedicalRecordNumber_NullRecordNumber_ShouldThrowArgumentNullException()
        {
            // Arrange
            var patient = CreateValidPatient();

            // Act & Assert
            Assert.Throws<ArgumentNullException>(() => patient.ChangeMedicalRecordNumber(null));
        }

        [Fact]
        public void ChangeContactInformation_ValidContactInformation_ShouldChangeContactInformation()
        {
            // Arrange
            var newContactInfo = new Mock<PatientContactInformation>().Object;
            var patient = CreateValidPatient();

            // Act
            patient.ChangeContactInformation(newContactInfo);

            // Assert
            Assert.Equal(newContactInfo, patient.ContactInformation);
        }

        [Fact]
        public void ChangeContactInformation_NullContactInformation_ShouldThrowArgumentNullException()
        {
            // Arrange
            var patient = CreateValidPatient();

            // Act & Assert
            Assert.Throws<ArgumentNullException>(() => patient.ChangeContactInformation(null));
        }

        [Fact]
        public void ChangeEmergencyContact_ValidEmergencyContact_ShouldChangeEmergencyContact()
        {
            // Arrange
            var newEmergencyContact = new Mock<PatientEmergencyContact>().Object;
            var patient = CreateValidPatient();

            // Act
            patient.ChangeEmergencyContact(newEmergencyContact);

            // Assert
            Assert.Equal(newEmergencyContact, patient.EmergencyContact);
        }

        [Fact]
        public void ChangeEmergencyContact_NullEmergencyContact_ShouldThrowArgumentNullException()
        {
            // Arrange
            var patient = CreateValidPatient();

            // Act & Assert
            Assert.Throws<ArgumentNullException>(() => patient.ChangeEmergencyContact(null));
        }

        [Fact]
        public void Deactivate_ShouldSetActiveToFalse()
        {
            // Arrange
            var patient = CreateValidPatient();

            // Act
            patient.Deactivate();

            // Assert
            Assert.False(patient.Active);
        }

        [Fact]
        public void Activate_ShouldSetActiveToTrue()
        {
            // Arrange
            var patient = CreateValidPatient();
            patient.Deactivate(); // Ensure it's inactive first

            // Act
            patient.Activate();

            // Assert
            Assert.True(patient.Active);
        }

        private Patient CreateValidPatient()
        {
            var firstName = new Mock<PatientFirstName>().Object;
            var lastName = new Mock<PatientLastName>().Object;
            var fullName = new Mock<PatientFullName>().Object;
            var birthDate = new Mock<PatientBirthDate>().Object;
            var gender = new Mock<PatientGender>().Object;
            var medicalRecordNumber = new Mock<PatientMedicalRecordNumber>().Object;
            var contactInfo = new Mock<PatientContactInformation>().Object;
            var emergencyContact = new Mock<PatientEmergencyContact>().Object;

            return new Patient(firstName, lastName, fullName, birthDate, gender, medicalRecordNumber, contactInfo, emergencyContact);
        }
    }
}