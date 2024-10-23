using System;
using System.Collections.Generic;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Users;


namespace DDDSample1.Domain.Patients
{
    public class PatientDto
    {

        public string MedicalRecordNumber { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public string BirthDate { get; set; }
        public string Gender { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string MedicalRecord { get; set; }
        public string EmergencyContact { get; set; }
        public string AppointmentHistory { get; set; }
        public User User { get; set; }
        public bool Active { get; set; }
    }
}