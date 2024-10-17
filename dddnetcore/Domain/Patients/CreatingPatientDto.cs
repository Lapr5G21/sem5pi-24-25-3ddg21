using System;
using System.Collections.Generic;
using DDDSample1.Domain.Patients;

namespace DDDSample1.Domain.Patients
{
    public class CreatingPatientDto
    {
        public PatientFirstName FirstName { get; set; }
        public PatientLastName LastName { get; set; }
        public PatientBirthDate BirthDate { get; set; }
        public PatientGender Gender { get; set; }
        public PatientMedicalRecordNumber MedicalRecordNumber { get; set; }
        public PatientPhoneNumber PhoneNumber { get; set; }
        public PatientEmergencyContact EmergencyContact { get; set; }
        public PatientContactInformation ContactInformation { get; set; }

        public CreatingPatientDto(
            PatientFirstName firstName,
            PatientLastName lastName,
            PatientBirthDate birthDate,
            PatientGender gender,
            PatientMedicalRecordNumber medicalRecordNumber,
            PatientContactInformation contactInformation,
            PatientEmergencyContact emergencyContact)
        {
            this.FirstName = firstName;
            this.LastName = lastName;
            this.BirthDate = birthDate;
            this.Gender = gender;
            this.MedicalRecordNumber = medicalRecordNumber;
            this.ContactInformation = contactInformation;
            this.EmergencyContact = emergencyContact;
        }
    }
}