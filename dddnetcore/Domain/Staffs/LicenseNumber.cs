using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Staffs{
public class LicenseNumber : IValueObject
{
    public string Number { get; set;}

    private LicenseNumber() { }

    public LicenseNumber(string number)
    {
        if (string.IsNullOrWhiteSpace(number))
            throw new BusinessRuleValidationException("License number cannot be empty or null.");

        Number = number;
    }

    public override bool Equals(object obj)
    {
        if (obj == null || GetType() != obj.GetType())
            return false;

        var other = (LicenseNumber)obj;
        return Number.Equals(other.Number);
    }

    public override int GetHashCode()
    {
        return Number.GetHashCode();
    }

    public override string ToString()
    {
        return Number;
    }
    }
}