using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients{
public class PatientFirstName : IValueObject
{
    public string FirstName { get; set;}

    private PatientFirstName() { }

    public PatientFirstName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new BusinessRuleValidationException("Name cannot be empty or null.");

        FirstName = name;
    }

    public override bool Equals(object obj)
    {
        if (obj == null || GetType() != obj.GetType())
            return false;

        var other = (PatientFirstName)obj;
        return FirstName.Equals(other.FirstName);
    }

    public override int GetHashCode()
    {
        return FirstName.GetHashCode();
    }

    public override string ToString()
    {
        return FirstName;
    }
    }
}