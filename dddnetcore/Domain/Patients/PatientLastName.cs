using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients{
public class PatientLastName : IValueObject
{
    public string LastName { get; set;}

    private PatientLastName() { }

    public PatientLastName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new BusinessRuleValidationException("Name cannot be empty or null.");

        LastName = name;
    }

    public override bool Equals(object obj)
    {
        if (obj == null || GetType() != obj.GetType())
            return false;

        var other = (PatientLastName)obj;
        return LastName.Equals(other.LastName);
    }

    public override int GetHashCode()
    {
        return LastName.GetHashCode();
    }

    public override string ToString()
    {
        return LastName;
    }
    }
}