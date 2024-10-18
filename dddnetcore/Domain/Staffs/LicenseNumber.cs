using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Staffs{
public class LicenseNumber : IValueObject
{
    public string LicenseNumberString { get; set;}

    private LicenseNumber() { }

    public LicenseNumber(string number)
    {
        if (string.IsNullOrWhiteSpace(number))
            throw new BusinessRuleValidationException("License number cannot be empty or null.");

        LicenseNumberString = number;
    }

    public override bool Equals(object obj)
    {
        if (obj == null || GetType() != obj.GetType())
            return false;

        var other = (LicenseNumber)obj;
        return LicenseNumberString.Equals(other.LicenseNumberString);
    }

    public override int GetHashCode()
    {
        return LicenseNumberString.GetHashCode();
    }

    public override string ToString()
    {
        return LicenseNumberString;
    }
    }
}