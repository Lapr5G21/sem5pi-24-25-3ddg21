using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients
{
    public class PatientContactInformation : IValueObject
    {
        public PatientBirthDate BirthDate { get; private set; }
        public PatientPhoneNumber PhoneNumber { get; private set; }

        public PatientContactInformation(PatientBirthDate birthDate, PatientPhoneNumber phoneNumber)
        {
            if (birthDate == null || phoneNumber == null)
            {
                throw new BusinessRuleValidationException("Both birth date and phone number must be provided.");
            }

            this.BirthDate = birthDate;
            this.PhoneNumber = phoneNumber;
        }

        public override string ToString()
        {
            return $"Birth Date: {BirthDate}, Phone Number: {PhoneNumber.PhoneNumber}";
        }
    }
}
