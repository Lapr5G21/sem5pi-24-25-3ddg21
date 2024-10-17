using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Staffs{
public class StaffLastName : IValueObject
{
    public string LastNameString { get; set;}

    private StaffLastName() { }

    public StaffLastName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new BusinessRuleValidationException("Name cannot be empty or null.");

        LastNameString = name;
    }

    public override bool Equals(object obj)
    {
        if (obj == null || GetType() != obj.GetType())
            return false;

        var other = (StaffLastName)obj;
        return LastNameString.Equals(other.LastNameString);
    }

    public override int GetHashCode()
    {
        return LastNameString.GetHashCode();
    }

    public override string ToString()
    {
        return LastNameString;
    }
    }
}