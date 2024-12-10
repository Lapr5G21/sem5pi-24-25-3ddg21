using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.RoomTypes
{
    public class RoomTypeSurgerySuitability : IValueObject
    {
        public bool IsSuitableForSurgery { get; private set; }

        public RoomTypeSurgerySuitability(bool isSuitableForSurgery)
        {
            this.IsSuitableForSurgery = isSuitableForSurgery;
        }

        public override bool Equals(object obj)
        {
            if (obj == null || GetType() != obj.GetType())
                return false;

            return IsSuitableForSurgery == ((RoomTypeSurgerySuitability)obj).IsSuitableForSurgery;
        }

        public override int GetHashCode()
        {
            return IsSuitableForSurgery.GetHashCode();
        }

        public override string ToString()
        {
            return IsSuitableForSurgery ? "Suitable for Surgery" : "Not Suitable for Surgery";
        }
    }
}
