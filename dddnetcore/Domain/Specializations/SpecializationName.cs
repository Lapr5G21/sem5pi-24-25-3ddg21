using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Specializations{
public class SpecializationName : IValueObject
{
    public string Name { get; }

    private SpecializationName(){}

    public SpecializationName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new BusinessRuleValidationException("Specialization name cannot be empty or null.");
        Name = name;
    }

    public override bool Equals(object obj)
    {
        if (obj == null || GetType() != obj.GetType())
            return false;

        var other = (SpecializationName)obj;
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