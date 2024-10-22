using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients
{
    public class PatientAddress : IValueObject
{
    public string AddressString { get; private set; }

    public PatientAddress(string address)
    {
        if (string.IsNullOrWhiteSpace(address))
        {
            throw new BusinessRuleValidationException("Address cannot be empty.");
        }

        this.AddressString = address;
    }

        public override int GetHashCode()
    {
        return AddressString.GetHashCode();
    }

    public override string ToString()
    {
        return AddressString;
    }
}
}