using System;
using DDDSample1.Domain.RoomTypes;

namespace DDDSample1.Domain.SurgeryRooms
{
    public class SurgeryRoomDto
    {
        public string Id { get; set; }
        public RoomTypeDto RoomType { get; set; }
        public int RoomCapacity { get; set; }
        public string MaintenanceSlots { get; set; }
        public string Equipment { get; set; }
        public string Status { get; set; }
    }
}
