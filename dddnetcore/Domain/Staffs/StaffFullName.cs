using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Staffs{
public class StaffFullName : IValueObject
{
    public string FullNameString { get; set;}

    private StaffFullName() { }

    public StaffFullName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new BusinessRuleValidationException("Name cannot be empty or null.");

        FullNameString = name;
    }

    public override bool Equals(object obj)
    {
        if (obj == null || GetType() != obj.GetType())
            return false;

        var other = (StaffFullName)obj;
        return FullNameString.Equals(other.FullNameString);
    }

    public override int GetHashCode()
    {
        return FullNameString.GetHashCode();
    }

    public override string ToString()
    {
        return FullNameString;
    }
    }
}