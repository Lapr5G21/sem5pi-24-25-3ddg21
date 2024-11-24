using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.OperationRequests
{
    public class DeadlineDate : IValueObject
    {
        public DateTime Value { get; private set; }

        public DeadlineDate(DateTime value)
        {
            /*if (value <= DateTime.Now)
            {
                throw new BusinessRuleValidationException("A data limite deve ser no futuro.");
            }*/

            Value = value;
        }

        public override string ToString()
        {
            return $"{Value} -> DeadlineDate";
        }

        public override bool Equals(object obj)
        {
            if (obj == null || GetType() != obj.GetType())
                return false;

            var other = (DeadlineDate)obj;
            return Value == other.Value;
        }

        public override int GetHashCode()
        {
            return Value.GetHashCode();
        }
    }
}
