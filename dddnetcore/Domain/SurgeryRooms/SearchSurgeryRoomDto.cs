using System;
using DDDSample1.Domain.RoomTypes;

namespace DDDSample1.Domain.SurgeryRooms
{
    public class SearchSurgeryRoomDto
    {
        public string Id { get; set; }
        public string RoomTypeCode { get; set; }
        public string MaintenanceSlots { get; set; }
        public string Equipment { get; set; }
        public string Status { get; set; }
    }
}
