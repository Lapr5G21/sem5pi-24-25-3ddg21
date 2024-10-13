using System;

namespace DDDSample1.Domain.OperationTypesSpecializations
{
    public class NumberOfStaff
    {
        public int Number { get; private set; }

        public NumberOfStaff(int number)
        {
            if (number < 0)
                throw new ArgumentException("Number of staff cannot be negative.");

            Number = number;
        }

        public int GetStaffCount()
        {
            return Number;
        }
    }
}
