using System;
using System.Collections.Generic;
using DDDSample1.Domain.Patients;

namespace DDDSample1.Domain.Patients
{
    public class PatientDto
    {

        public PatientFirstName FirstName { get; set; }
        public PatientLastName LastName { get; set; }
        public PatientFullName FullName { get; set; }
        public PatientBirthDate BirthDate { get; set; }
        public PatientGender Gender { get; set; }
        public PatientMedicalRecordNumber MedicalRecordNumber { get; set; }
        public PatientEmail Email { get; set; }
        public PatientPhoneNumber PhoneNumber { get; set; }
        public PatientEmergencyContact EmergencyContact { get; set; }
        public bool Active { get; set; }
    }
}