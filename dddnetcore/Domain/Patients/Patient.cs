using System;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Users;
using Microsoft.IdentityModel.Tokens;

namespace DDDSample1.Domain.Patients
{
    public class Patient : Entity<PatientMedicalRecordNumber>, IAggregateRoot
    {
        public PatientFirstName FirstName { get; set; }
        public PatientLastName LastName { get; set; }
        public PatientFullName FullName { get; set; }
        public PatientBirthDate BirthDate { get; set; }
        public PatientGender Gender { get; set; }
        public PatientEmail Email { get; set; }
        public PatientPhoneNumber PhoneNumber { get; set; }
        public PatientAddress Address { get; set; }
        public PatientMedicalRecord MedicalRecord { get; set; }
        public PatientEmergencyContact EmergencyContact { get; set; }
        public PatientAppointmentHistory AppointmentHistory { get; set; }
        public User User { get; set; }
        public bool Active { get; set; }

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
            PatientAddress address,
            PatientMedicalRecord medicalRecord,
            PatientEmergencyContact emergencyContact,
            PatientAppointmentHistory appointmentHistory)
        {
            this.Id = medicalRecordNumber;
            this.FirstName = firstName;
            this.LastName = lastName;
            this.FullName = fullName;
            this.BirthDate = birthDate;
            this.Gender = gender;
            this.Email = email;
            this.PhoneNumber = phoneNumber;
            this.Address = address;
            this.MedicalRecord = medicalRecord;
            this.EmergencyContact = emergencyContact;
            this.AppointmentHistory = appointmentHistory;
            this.Active = true;
            this.User = null;
        }


        public void ChangeFirstName(PatientFirstName newFirstName)
        {
            if (newFirstName == null) throw new ArgumentNullException(nameof(newFirstName));
            this.FirstName = newFirstName; 
        }

        public void ChangeLastName(PatientLastName newLastName)
        {
            if (newLastName == null) throw new ArgumentNullException(nameof(newLastName));
            this.LastName = newLastName; 
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

        public void ChangeAddress(PatientAddress newAddress)
        {
            if (newAddress == null) throw new ArgumentNullException(nameof(newAddress));
            this.Address = newAddress;
        }

        public void ChangeMedicalRecord(PatientMedicalRecord newMedicalRecord)
        {
            if (newMedicalRecord == null) throw new ArgumentNullException(nameof(newMedicalRecord));
            if(newMedicalRecord.MedicalRecord.IsNullOrEmpty()){
                return;
            }
            if(newMedicalRecord!=this.MedicalRecord){
            this.MedicalRecord = new PatientMedicalRecord(this.MedicalRecord.ToString() + "; " + newMedicalRecord.ToString());
            }
        }

        public void ChangeEmergencyContact(PatientEmergencyContact newEmergencyContact)
        {
            if (newEmergencyContact == null) throw new ArgumentNullException(nameof(newEmergencyContact));
            this.EmergencyContact = newEmergencyContact;
        }

        public void ChangeAppointmentHistory(PatientAppointmentHistory newAppointmentHistory)
        {
            if (newAppointmentHistory == null) throw new ArgumentNullException(nameof(newAppointmentHistory));
            if(newAppointmentHistory!=this.AppointmentHistory){
            this.AppointmentHistory = new PatientAppointmentHistory(this.AppointmentHistory.ToString() + "; " + newAppointmentHistory.ToString());
        }
        }

        public void SetUser(User user){
            this.User= user; 
        }

        public void Deactivate()
        {
            this.Active = false;
        }

        public void Activate()
        {
            this.Active = true;
        }

        public override string ToString()
        {
            return $"Patient: {FullName}, Gender: {Gender}, Birth Date: {BirthDate}, Medical Record Number: {Id}, Email: {Email}, Phone Number : {PhoneNumber}, Address : {Address}, Medical Record: {MedicalRecord}, Emergency Contact: {EmergencyContact}, Active: {Active}";
        }
    }
}
