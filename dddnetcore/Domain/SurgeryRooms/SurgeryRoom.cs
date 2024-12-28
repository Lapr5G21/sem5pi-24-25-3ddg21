using System;
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

        public void UpdateRoomType(RoomType newRoomType)
        {
            if (newRoomType == null)
                throw new ArgumentNullException(nameof(newRoomType), "Room type cannot be null.");

            this.RoomType = newRoomType;
        }

        public void UpdateRoomCapacity(SurgeryRoomCapacity newRoomCapacity)
        {
            if (newRoomCapacity == null)
                throw new ArgumentNullException(nameof(newRoomCapacity), "Room capacity cannot be null.");

            this.RoomCapacity = newRoomCapacity;
        }

        public void UpdateMaintenanceSlots(SurgeryRoomMaintenanceSlots newMaintenanceSlots)
        {
            if (newMaintenanceSlots == null)
                throw new ArgumentNullException(nameof(newMaintenanceSlots), "Maintenance slots cannot be null.");

            this.MaintenanceSlots = newMaintenanceSlots;
        }

        public void UpdateEquipment(SurgeryRoomEquipment newEquipment)
        {
            if (newEquipment == null)
                throw new ArgumentNullException(nameof(newEquipment), "Equipment cannot be null.");

            this.Equipment = newEquipment;
        }

        public void UpdateStatus(SurgeryRoomStatus newStatus)
        {
            this.Status = newStatus;
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