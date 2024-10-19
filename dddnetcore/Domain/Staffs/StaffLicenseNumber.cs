using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Staffs{
public class StaffLicenseNumber : IValueObject
{
    public string LicenseNumberString { get; private set; }

    private StaffLicenseNumber() { }

    public StaffLicenseNumber(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new BusinessRuleValidationException("License number cannot be empty or null.");

        LicenseNumberString = value;
    }

    public override bool Equals(object obj)
    {
        if (obj == null || GetType() != obj.GetType())
            return false;

        var other = (StaffLicenseNumber)obj;
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