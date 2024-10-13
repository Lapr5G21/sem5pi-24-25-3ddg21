using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.OperationTypes{
public class OperationTypeName
{
    public string Name { get; }


    public OperationTypeName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new BusinessRuleValidationException("Operation type name cannot be empty or null.");

        Name = name;
    }

    public override bool Equals(object obj)
    {
        if (obj == null || GetType() != obj.GetType())
            return false;

        var other = (OperationTypeName)obj;
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