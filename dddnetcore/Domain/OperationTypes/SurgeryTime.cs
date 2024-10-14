using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.OperationTypes{
public class SurgeryTime : IValueObject
{
    public int Minutes { get; private set; }

    public SurgeryTime(int minutes)
    {
        if (minutes <= 0)
            throw new BusinessRuleValidationException("Surgery time must be greater than zero.");

        Minutes = minutes;
    }

    public override string ToString()
    {
        return $"{Minutes} minutes";
    }

    public override bool Equals(object obj)
    {
        if (obj == null || GetType() != obj.GetType())
            return false;

        var other = (SurgeryTime)obj;
        return Minutes == other.Minutes;
    }

    public override int GetHashCode()
    {
        return Minutes.GetHashCode();
        }
    }
}
