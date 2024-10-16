using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Staffs{
public class StaffFullName : IValueObject
{
    public string Name { get; set;}

    private StaffFullName() { }

    public StaffFullName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new BusinessRuleValidationException("Name cannot be empty or null.");

        Name = name;
    }

    public override bool Equals(object obj)
    {
        if (obj == null || GetType() != obj.GetType())
            return false;

        var other = (StaffFullName)obj;
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