using System;
using System.Collections.Generic;
using DDDSample1.Domain.Patients;


namespace DDDSample1.Domain.Patients
{
    public class SearchPatientDto
    {

        public string MedicalRecordNumber { get; set; }
        public string FullName { get; set; }
        public string BirthDate { get; set; }
        public string Gender { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public bool? Active { get; set; }
    }
}