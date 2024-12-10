using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.RoomTypes
{
    public class RoomType : Entity<RoomTypeCode>, IAggregateRoot
    {
        public RoomTypeDesignation Designation { get; private set; }
        public RoomTypeDescription Description { get; private set; }
        public RoomTypeSurgerySuitability SurgerySuitability { get; private set; }


        private RoomType() { }

        public RoomType(
            RoomTypeCode code,
            RoomTypeDesignation designation,
            RoomTypeDescription description,
            RoomTypeSurgerySuitability surgerySuitability)
        {
            this.Id = code;
            this.Designation = designation;
            this.Description = description;
            this.SurgerySuitability = surgerySuitability;
        }

        public override bool Equals(object obj)
        {
            if (obj == null || GetType() != obj.GetType())
                return false;

            var other = (RoomType)obj;
            return Id.Equals(other.Id);
        }

        public override int GetHashCode()
        {
            return Id.GetHashCode();
        }
    }
}
