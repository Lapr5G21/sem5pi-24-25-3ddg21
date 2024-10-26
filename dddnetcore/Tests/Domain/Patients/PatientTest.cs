 using Moq;
 using System;
using Xunit;
 using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Patients;

namespace DDDSample1.Tests.Domain.Patients
{
    public class PatientTest
    {
        /*
        [Fact]
        public void CreatePatient_ValidData_ShouldCreatePatient()
        {
            // Arrange - cria mocks para cada parâmetro necessário para criar um paciente.
            var firstName = new Mock<PatientFirstName>().Object;
            var lastName = new Mock<PatientLastName>().Object;
            var fullName = new Mock<PatientFullName>().Object;
            var birthDate = new Mock<PatientBirthDate>().Object;
            var gender = new Mock<PatientGender>().Object;
            var medicalRecordNumber = new Mock<PatientMedicalRecordNumber>().Object;
            var email = new Mock<PatientEmail>().Object;
            var phoneNumber = new Mock<PatientPhoneNumber>().Object;
            var emergencyContact = new Mock<PatientEmergencyContact>().Object;

            // Act
            // var patient = new Patient(firstName, lastName, fullName, birthDate, gender, medicalRecordNumber, email, phoneNumber, emergencyContact);

            // Assert
            // Assert.Equal(firstName, patient.FirstName);
            // Assert.Equal(lastName, patient.LastName);
            // Assert.Equal(fullName, patient.FullName);
            // Assert.Equal(birthDate, patient.BirthDate);
            // Assert.Equal(gender, patient.Gender);
            // Assert.Equal(medicalRecordNumber, patient.MedicalRecordNumber);
            // Assert.Equal(email, patient.Email);
            // Assert.Equal(phoneNumber, patient.PhoneNumber);
            // Assert.Equal(emergencyContact, patient.EmergencyContact);
            // Assert.True(patient.Active);
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
        public void ChangeEmail_ValidEmail_ShouldChangeEmail()
        {
            // Arrange
            var newEmail = new Mock<PatientEmail>().Object;
            var patient = CreateValidPatient();

            // Act
            patient.ChangeEmail(newEmail);

            // Assert
            Assert.Equal(newEmail, patient.Email);
        }

        [Fact]
        public void ChangeEmail_NullEmail_ShouldThrowArgumentNullException()
        {
            // Arrange
            var patient = CreateValidPatient();

            // Act & Assert
            Assert.Throws<ArgumentNullException>(() => patient.ChangeEmail(null));
        }

        [Fact]
        public void ChangePhoneNumber_ValidPhoneNumber_ShouldChangePhoneNumber()
        {
            // Arrange
            var newPhoneNumber = new Mock<PatientPhoneNumber>().Object;
            var patient = CreateValidPatient();

            // Act
            patient.ChangePhoneNumber(newPhoneNumber);

            // Assert
            Assert.Equal(newPhoneNumber, patient.PhoneNumber);
        }

        [Fact]
        public void ChangePhoneNumber_NullPhoneNumber_ShouldThrowArgumentNullException()
        {
            // Arrange
            var patient = CreateValidPatient();

            // Act & Assert
            Assert.Throws<ArgumentNullException>(() => patient.ChangePhoneNumber(null));
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
            patient.Deactivate(); // Garante que o paciente está inativo primeiro

            // Act
            patient.Activate();

            // Assert
            Assert.True(patient.Active);
        }

        // private Patient CreateValidPatient()
        //{
        //   var firstName = new Mock<PatientFirstName>().Object;
        //   var lastName = new Mock<PatientLastName>().Object;
        //   var fullName = new Mock<PatientFullName>().Object;
        //   var birthDate = new Mock<PatientBirthDate>().Object;
        //   var gender = new Mock<PatientGender>().Object;
        //   var medicalRecordNumber = new Mock<PatientMedicalRecordNumber>().Object;
        //   var email = new Mock<PatientEmail>().Object;
        //   var phoneNumber = new Mock<PatientPhoneNumber>().Object;
        //   var emergencyContact = new Mock<PatientEmergencyContact>().Object;

        //   return new Patient(firstName, lastName, fullName, birthDate, gender, medicalRecordNumber, email, phoneNumber, emergencyContact);
        //}
        */
    }
}

