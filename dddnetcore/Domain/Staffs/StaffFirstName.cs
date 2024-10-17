using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Staffs{
public class StaffFirstName : IValueObject
{
    public string Name { get; set;}

    private StaffFirstName() { }

    public StaffFirstName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new BusinessRuleValidationException("Name cannot be empty or null.");

        Name = name;
    }

    public override bool Equals(object obj)
    {
        if (obj == null || GetType() != obj.GetType())
            return false;

        var other = (StaffFirstName)obj;
        return Name.Equals(other.Name);
    }

    public override int GetHashCode()
    {
        return Name.GetHashCode();
    }

    public override string ToString()
    {
        return Name;
    }
    }
}