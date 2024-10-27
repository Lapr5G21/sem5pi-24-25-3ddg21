using Xunit;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;
using System;

namespace DDDSample1.Tests.Domain.Patients
{
    public class PatientTest
    {
        [Fact]
        public void Constructor_ValidParameters_ShouldSetProperties()
        {
            // Arrange
            var medicalRecordNumber = new PatientMedicalRecordNumber("202411000123");
            var firstName = new PatientFirstName("João");
            var lastName = new PatientLastName("Silva");
            var fullName = new PatientFullName("João Silva");
            var birthDate = new PatientBirthDate("1990-05-20");
            var gender = PatientGender.Male;
            var email = new PatientEmail("joao.silva@example.com");
            var phoneNumber = new PatientPhoneNumber("912345678");
            var address = new PatientAddress("Av. da Liberdade, 123, 5º A, 1250-001 Lisboa");
            var medicalRecord = new PatientMedicalRecord("Sem histórico médico anterior.");
            var emergencyContact = new PatientEmergencyContact("919876543");
            var appointmentHistory = new PatientAppointmentHistory("Sem consultas anteriores.");

            var patient = new Patient(
                medicalRecordNumber,
                firstName,
                lastName,
                fullName,
                birthDate,
                gender,
                email,
                phoneNumber,
                address,
                medicalRecord,
                emergencyContact,
                appointmentHistory);

            Assert.Equal(medicalRecordNumber, patient.Id);
            Assert.Equal(firstName, patient.FirstName);
            Assert.Equal(lastName, patient.LastName);
            Assert.Equal(fullName, patient.FullName);
            Assert.Equal(birthDate, patient.BirthDate);
            Assert.Equal(gender, patient.Gender);
            Assert.Equal(email, patient.Email);
            Assert.Equal(phoneNumber, patient.PhoneNumber);
            Assert.Equal(address, patient.Address);
            Assert.Equal(medicalRecord, patient.MedicalRecord);
            Assert.Equal(emergencyContact, patient.EmergencyContact);
            Assert.Equal(appointmentHistory, patient.AppointmentHistory);
            Assert.True(patient.Active);
            Assert.Null(patient.User);
        }

        [Fact]
        public void ChangeFirstName_ValidFirstName_ShouldUpdateFirstName()
        {
            var patient = CreateValidPatient();
            var newFirstName = new PatientFirstName("Maria");

            patient.ChangeFirstName(newFirstName);

            Assert.Equal(newFirstName, patient.FirstName);
        }

        [Fact]
        public void ChangeLastName_ValidLastName_ShouldUpdateLastName()
        {
            var patient = CreateValidPatient();
            var newLastName = new PatientLastName("Pereira");

            patient.ChangeLastName(newLastName);

            Assert.Equal(newLastName, patient.LastName);
        }
       

        [Fact]
        public void ChangeEmail_ValidEmail_ShouldUpdateEmail()
        {
            var patient = CreateValidPatient();
            var newEmail = new PatientEmail("maria.pereira@example.com");

            patient.ChangeEmail(newEmail);

            Assert.Equal(newEmail, patient.Email);
        }

        [Fact]
        public void Deactivate_ShouldSetActiveToFalse()
        {
            var patient = CreateValidPatient();

            patient.Deactivate();

            Assert.False(patient.Active);
        }

        [Fact]
        public void Activate_ShouldSetActiveToTrue()
        {
            var patient = CreateValidPatient();
            patient.Deactivate(); 
            patient.Activate();

            Assert.True(patient.Active);
        }

        private Patient CreateValidPatient()
        {
            var medicalRecordNumber = new PatientMedicalRecordNumber("123456789012");
            var firstName = new PatientFirstName("João");
            var lastName = new PatientLastName("Silva");
            var fullName = new PatientFullName("João Silva");
            var birthDate = new PatientBirthDate("1990-05-20");
            var gender = PatientGender.Male;
            var email = new PatientEmail("joao.silva@example.com");
            var phoneNumber = new PatientPhoneNumber("912345678");
            var address = new PatientAddress("Av. da Liberdade, 123, 5º A, 1250-001 Lisboa");
            var medicalRecord = new PatientMedicalRecord("Sem histórico médico anterior.");
            var emergencyContact = new PatientEmergencyContact("919876543");
            var appointmentHistory = new PatientAppointmentHistory("Sem consultas anteriores.");

            return new Patient(
                medicalRecordNumber,
                firstName,
                lastName,
                fullName,
                birthDate,
                gender,
                email,
                phoneNumber,
                address,
                medicalRecord,
                emergencyContact,
                appointmentHistory);
        }
    }
}
