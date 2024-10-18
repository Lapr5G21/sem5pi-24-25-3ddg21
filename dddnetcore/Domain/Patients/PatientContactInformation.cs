using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients
{
    public class PatientContactInformation : IValueObject
    {
        public PatientEmail Email { get; private set; }
        public PatientPhoneNumber PhoneNumber { get; private set; }

        public PatientContactInformation(PatientEmail email, PatientPhoneNumber phoneNumber)
        {
            if (email == null || phoneNumber == null)
            {
                throw new BusinessRuleValidationException("Both email and phone number must be provided.");
            }

            this.Email = email;
            this.PhoneNumber = phoneNumber;
        }

        public override string ToString()
        {
            return $"Email: {Email}, Phone Number: {PhoneNumber.PhoneNumber}";
        }
    }
}
