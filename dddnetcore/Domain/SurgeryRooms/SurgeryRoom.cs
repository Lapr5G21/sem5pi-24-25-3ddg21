using DDDSample1.Domain.Shared;
using DDDSample1.Domain.RoomTypes;


namespace DDDSample1.Domain.SurgeryRooms
{
    public class SurgeryRoom : Entity<SurgeryRoomNumber>, IAggregateRoot {
    
        public RoomType RoomType {get; private set;}
        public RoomTypeCode RoomTypeCode {get; private set;}
        public SurgeryRoomCapacity RoomCapacity {get; private set;}
        public SurgeryRoomMaintenanceSlots MaintenanceSlots {get; private set;}
        public SurgeryRoomEquipment Equipment {get; private set;}
        public SurgeryRoomStatus Status {get; private set;}


        private SurgeryRoom() {}

        public SurgeryRoom(
            SurgeryRoomNumber roomNumber,
            RoomType roomType,
            SurgeryRoomCapacity roomCapacity,
            SurgeryRoomMaintenanceSlots maintenanceSlots,
            SurgeryRoomEquipment equipment,
            SurgeryRoomStatus status
        ) {
            this.Id = roomNumber;
            this.RoomType = roomType;
            this.RoomCapacity = roomCapacity;
            this.MaintenanceSlots = maintenanceSlots;
            this.Equipment = equipment;
            this.Status = status;
        }

        public override bool Equals(object obj)
        {
            if (obj == null || GetType() != obj.GetType())
                return false;

            var other = (SurgeryRoom)obj;
            return Id.Equals(other.Id);
        }

        public override int GetHashCode()
        {
            return Id.GetHashCode();
        }
    }
}