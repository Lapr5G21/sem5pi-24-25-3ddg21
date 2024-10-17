using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients{
public class PatientFullName : IValueObject
{
    public string FullName { get; set;}

    private PatientFullName() { }

    public PatientFullName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new BusinessRuleValidationException("Name cannot be empty or null.");

        FullName = name;
    }

    public override bool Equals(object obj)
    {
        if (obj == null || GetType() != obj.GetType())
            return false;

        var other = (PatientFullName)obj;
        return FullName.Equals(other.FullName);
    }

    public override int GetHashCode()
    {
        return FullName.GetHashCode();
    }

    public override string ToString()
    {
        return FullName;
    }
    }
}