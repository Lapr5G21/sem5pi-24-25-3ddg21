using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Specializations{
public class SpecializationCode : IValueObject
{
    public string Code { get; }

    private SpecializationCode(){}

    public SpecializationCode(string code)
    {
        if (string.IsNullOrWhiteSpace(code))
            throw new BusinessRuleValidationException("Specialization code cannot be empty or null.");
        Code = code;
    }

    public override bool Equals(object obj)
    {
        if (obj == null || GetType() != obj.GetType())
            return false;

        var other = (SpecializationCode)obj;
        return Code.Equals(other.Code);
    }

    public override int GetHashCode()
    {
        return Code.GetHashCode();
    }

    public override string ToString()
    {
        return Code;
    }
    }
}