using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients
{
    public class PatientBirthDate : IValueObject
{
    public string BirthDateString { get; private set; }

    public PatientBirthDate(string date)
    {
        if (string.IsNullOrWhiteSpace(date))
        {
            throw new BusinessRuleValidationException("Date of Birth cannot be empty.");
        }

        this.BirthDateString = date;
    }

        public override int GetHashCode()
    {
        return BirthDateString.GetHashCode();
    }

    public override string ToString()
    {
        return BirthDateString;
    }
}
}