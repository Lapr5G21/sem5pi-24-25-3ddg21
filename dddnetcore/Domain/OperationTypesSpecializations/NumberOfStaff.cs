using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.OperationTypesSpecializations
{
    public class NumberOfStaff : IValueObject
    {
        public int Number { get; private set; }

        public NumberOfStaff(int number)
        {
            if (number <= 0)
                throw new BusinessRuleValidationException("Number of staff cannot be negative.");

            Number = number;
        }

        public int GetStaffCount()
        {
            return Number;
        }
    }
}
