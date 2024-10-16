using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients{
public class PatientMedicalRecordNumber : IValueObject
{
    public string Number { get; set;}

    private PatientMedicalRecordNumber() { }

    public PatientMedicalRecordNumber(string number)
    {
        if (string.IsNullOrWhiteSpace(number))
            throw new BusinessRuleValidationException("Medical Record Number cannot be empty or null.");

        Number = number;
    }

    public override bool Equals(object obj)
    {
        if (obj == null || GetType() != obj.GetType())
            return false;

        var other = (PatientMedicalRecordNumber)obj;
        return Number.Equals(other.Number);
    }

    public override int GetHashCode()
    {
        return Number.GetHashCode();
    }

    public override string ToString()
    {
        return Number;
    }
    }
}