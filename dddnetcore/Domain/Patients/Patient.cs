using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients
{
    public class Patient : Entity<PatientMedicalRecordNumber>, IAggregateRoot
    {
        
        public PatientFirstName FirstName { get; private set; }
        public PatientLastName LastName { get; private set; }
        public PatientFullName FullName { get; private set; }
        public PatientBirthDate BirthDate { get; private set; }
        public PatientGender Gender { get; private set; }
        public PatientMedicalRecordNumber MedicalRecordNumber { get; private set; }
        public PatientContactInformation ContactInformation { get; private set; }
        public PatientEmergencyContact EmergencyContact { get; private set; }
        public bool Active { get; private set; }

        public Patient(
            PatientFirstName firstName,
            PatientLastName lastName,
            PatientFullName fullName,
            PatientBirthDate birthDate,
            PatientGender gender,
            PatientMedicalRecordNumber medicalRecordNumber,
            PatientContactInformation contactInformation,
            PatientEmergencyContact emergencyContact)
        {

            this.FirstName = firstName;
            this.LastName = lastName;
            this.FullName = fullName;
            this.BirthDate = birthDate;
            this.Gender = gender;
            this.MedicalRecordNumber = medicalRecordNumber;
            this.ContactInformation = contactInformation;
            this.EmergencyContact = emergencyContact;
            this.Active = true;
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
            this.MedicalRecordNumber = newMedicalRecordNumber;
        }

        public void ChangeContactInformation(PatientContactInformation newContactInformation)
        {
            if (newContactInformation == null) throw new ArgumentNullException(nameof(newContactInformation));
            this.ContactInformation = newContactInformation;
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

        public override string ToString()
        {
            return $"Patient: {FullName}, Gender: {Gender}, Birth Date: {BirthDate}, Medical Record Number: {MedicalRecordNumber}, Contact Information: {ContactInformation}, Emergency Contact: {EmergencyContact}, Active: {Active}";
        }
    }
}