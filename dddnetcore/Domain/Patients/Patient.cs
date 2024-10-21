using System;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Users;

namespace DDDSample1.Domain.Patients
{
    public class Patient : Entity<PatientMedicalRecordNumber>, IAggregateRoot
    {
        public PatientFirstName FirstName { get; private set; }
        public PatientLastName LastName { get; private set; }
        public PatientFullName FullName { get; private set; }
        public PatientBirthDate BirthDate { get; private set; }
        public PatientGender Gender { get; private set; }
        public PatientEmail Email { get; private set; }
        public PatientPhoneNumber PhoneNumber { get; private set; }
        public PatientMedicalRecord MedicalRecord { get; private set; }
        public PatientEmergencyContact EmergencyContact { get; private set; }
        public User User { get; set; }
        public bool Active { get; private set; }

        private Patient(){}
        public Patient(
            PatientMedicalRecordNumber medicalRecordNumber,
            PatientFirstName firstName,
            PatientLastName lastName,
            PatientFullName fullName,
            PatientBirthDate birthDate,
            PatientGender gender,
            PatientEmail email,
            PatientPhoneNumber phoneNumber,
            PatientMedicalRecord medicalRecord,
            PatientEmergencyContact emergencyContact)
        {
            this.Id = medicalRecordNumber;
            this.FirstName = firstName;
            this.LastName = lastName;
            this.FullName = fullName;
            this.BirthDate = birthDate;
            this.Gender = gender;
            this.Email = email;
            this.PhoneNumber = phoneNumber;
            this.MedicalRecord = medicalRecord;
            this.EmergencyContact = emergencyContact;
            this.Active = true;
            this.User = null;
        }


        public void ChangeName(PatientFullName newFullName)
        {
            if (newFullName == null) throw new ArgumentNullException(nameof(newFullName));
            this.FullName = newFullName; 
        }

        public void ChangeBirthDate(PatientBirthDate newBirthDate)
        {
            if (newBirthDate == null) throw new ArgumentNullException(nameof(newBirthDate));
            this.BirthDate = newBirthDate;
        }

        public void ChangeGender(PatientGender newGender)
        {
            if (newGender == null) throw new ArgumentNullException(nameof(newGender));
            this.Gender = newGender;
        }

        public void ChangeMedicalRecordNumber(PatientMedicalRecordNumber newMedicalRecordNumber)
        {
            if (newMedicalRecordNumber == null) throw new ArgumentNullException(nameof(newMedicalRecordNumber));
            this.Id = newMedicalRecordNumber;
        }

        public void ChangeEmail(PatientEmail newPatientEmail)
        {
            if (newPatientEmail == null) throw new ArgumentNullException(nameof(newPatientEmail));
            this.Email = newPatientEmail;
        }

        public void ChangePhoneNumber(PatientPhoneNumber newPhoneNumber)
        {
            if (newPhoneNumber == null) throw new ArgumentNullException(nameof(newPhoneNumber));
            this.PhoneNumber = newPhoneNumber;
        }

        public void ChangeMedicalRecord(PatientMedicalRecord newMedicalRecord)
        {
            if (newMedicalRecord == null) throw new ArgumentNullException(nameof(newMedicalRecord));
            this.MedicalRecord = newMedicalRecord;
        }

        public void ChangeEmergencyContact(PatientEmergencyContact newEmergencyContact)
        {
            if (newEmergencyContact == null) throw new ArgumentNullException(nameof(newEmergencyContact));
            this.EmergencyContact = newEmergencyContact;
        }

        public void Deactivate()
        {
            this.Active = false;
        }

        public void Activate()
        {
            this.Active = true;
        }

        public void SetUser(User user){
            this.User= user; 
        }
        public override string ToString()
        {
            return $"Patient: {FullName}, Gender: {Gender}, Birth Date: {BirthDate}, Medical Record Number: {Id}, Email: {Email}, Phone Number : {PhoneNumber}, Medical Record: {MedicalRecord}, Emergency Contact: {EmergencyContact}, Active: {Active}";
        }
    }
}
