using System;
using System.Collections.Generic;
using DDDSample1.Domain.Patients;

namespace DDDSample1.Domain.Patients
{
    public class CreatingPatientDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public string BirthDate { get; set; }
        public Gender Gender { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string EmergencyContact { get; set; }
        public bool Active { get; set; }
        public CreatingPatientDto(
            string firstName,
            string lastName,
            string fullName,
            string birthDate,
            Gender gender,
            string email,
            string phoneNumber,
            string address,
            string emergencyContact)
        {

            this.FirstName = firstName;
            this.LastName = lastName;
            this.FullName = fullName;
            this.BirthDate = birthDate;
            this.Gender = gender;
            this.Email = email;
            this.PhoneNumber = phoneNumber;
            this.Address = address;
            this.EmergencyContact = emergencyContact;
            this.Active = true;
        }
    }
}