using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.OperationRequest
{
    public class DeadlineDate : IValueObject
    {
        public DateTime DeadLineDate { get; private set; }

        public DeadlineDate(DateTime deadlineDate)
        {

            if (deadlineDate <= DateTime.Now)
            {
                throw new BusinessRuleValidationException("A data limite deve ser no futuro.");
            }

            DeadLineDate = deadlineDate;
        }

        public override string ToString()
        {
            return $"{DeadLineDate} -> DeadlineDate";
        }

        public override bool Equals(object obj)
        {
            if (obj == null || GetType() != obj.GetType())
                return false;

            var other = (DeadlineDate)obj;
            return DeadLineDate == other.DeadLineDate;
        }

        public override int GetHashCode()
        {
            return DeadLineDate.GetHashCode();
        }
    }
}
