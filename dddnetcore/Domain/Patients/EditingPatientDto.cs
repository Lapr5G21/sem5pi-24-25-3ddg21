using System;
using System.Collections.Generic;
using DDDSample1.Domain.Patients;

namespace DDDSample1.Domain.Patients
{
    public class EditingPatientDto
    {
        public string MedicalRecordNumber { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public string MedicalHistory { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
    }
}