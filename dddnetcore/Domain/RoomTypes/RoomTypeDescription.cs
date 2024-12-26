using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.RoomTypes
{
    public class RoomTypeDescription : IValueObject
    {
        public string Value { get; private set; }

        public RoomTypeDescription(string description)
        {
            this.Value = description;
        }

        public override bool Equals(object obj)
        {
            if (obj == null || GetType() != obj.GetType())
                return false;

            return Value.Equals(((RoomTypeDescription)obj).Value);
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
