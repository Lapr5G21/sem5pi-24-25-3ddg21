using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Staffs{
public class StaffFirstName : IValueObject
{
    public string FirstNameString { get; set;}

    private StaffFirstName() { }

    public StaffFirstName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new BusinessRuleValidationException("Name cannot be empty or null.");

        FirstNameString = name;
    }

    public override bool Equals(object obj)
    {
        if (obj == null || GetType() != obj.GetType())
            return false;

        var other = (StaffFirstName)obj;
        return FirstNameString.Equals(other.FirstNameString);
    }

    public override int GetHashCode()
    {
        return FirstNameString.GetHashCode();
    }

    public override string ToString()
    {
        return FirstNameString;
    }
    }
}