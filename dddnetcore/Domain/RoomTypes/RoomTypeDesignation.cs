using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.RoomTypes
{
    public class RoomTypeDesignation : IValueObject
    {
        
        private const int MaxLength = 100;
        public string Value { get; private set; }

        public RoomTypeDesignation(string designation)
        {
            if (string.IsNullOrWhiteSpace(designation))
                throw new BusinessRuleValidationException("Room designation cannot be null or empty.");

            if (designation.Length > MaxLength)
                throw new BusinessRuleValidationException("Room designation cannot exceed 100 characters.");

            this.Value = designation;
        }

        public override bool Equals(object obj)
        {
            if (obj == null || GetType() != obj.GetType())
                return false;

            return Value.Equals(((RoomTypeDesignation)obj).Value);
        }

        public override int GetHashCode()
        {
            return Value.GetHashCode();
        }

        public override string ToString()
        {
            return Value;
        }
    }
}
