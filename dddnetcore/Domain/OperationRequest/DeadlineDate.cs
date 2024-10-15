using DDDSample1.Domain.Shared;
namespace DDDSample1.Domain.OperationRequest{

public class DeadlineDate : IValueObject
{

    public Date DeadLineDate { get; private set;}

    public DeadlineDate
    (Date deadlineDate){

            if (deadlineDate == null)
            {
                throw new ArgumentNullException(nameof(deadlineDate), "A data não pode ser nula.");
            }

            if (deadlineDate <= DateTime.Now)
            {
                throw new BusinessRuleValidationException("A data limite deve ser no futuro.");
            }

            DeadLineDate = deadlineDate;
       
    }

    public override string ToString()
    {
        return $"{deadLineDate} -> deadLineDate";
    }

public override bool Equals(object obj)
    {
        if (obj == null || GetType() != obj.GetType())
            return false;

        var other = (DeadLineDate)obj;
        return deadlineDate == other.deadLineDate;
    }

 public override int GetHashCode()
    {
        return DeadLineDate.GetHashCode();
    }

    }
}