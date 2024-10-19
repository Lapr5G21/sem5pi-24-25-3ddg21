using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients{
public class PatientMedicalRecord : IValueObject
{
    public string MedicalRecord { get; set;}

    private PatientMedicalRecord() { }

    public PatientMedicalRecord(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
            throw new BusinessRuleValidationException("Medical Record cannot be empty or null.");

        MedicalRecord = text;
    }

    public override bool Equals(object obj)
    {
        if (obj == null || GetType() != obj.GetType())
            return false;

        var other = (PatientMedicalRecord)obj;
        return MedicalRecord.Equals(other.MedicalRecord);
    }

    public override int GetHashCode()
    {
        return MedicalRecord.GetHashCode();
    }

    public override string ToString()
    {
        return MedicalRecord;
    }
    }
}