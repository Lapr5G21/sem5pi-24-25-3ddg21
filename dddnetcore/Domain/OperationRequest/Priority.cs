using DDDSample1.Domain.Shared;
namespace DDDSample1.Domain.OperationRequest{

public class Priority : IValueObject
{

    public int PriorityLevel { get; private set;}

    public Priority(int priorityLevel){

        if (priorityLevel < 0 || priorityLevel > 5 )
        throw new BusinessRuleValidationException("Priority level out of scale.");

        PriorityLevel = priorityLevel;
    }

    public override string ToString()
    {
        return $"{PriorityLevel} -> priorityLevel";
    }

public override bool Equals(object obj)
    {
        if (obj == null || GetType() != obj.GetType())
            return false;

        var other = (Priority)obj;
        return PriorityLevel == other.PriorityLevel;
    }

 public override int GetHashCode()
    {
        return PriorityLevel.GetHashCode();
    }

    }
}