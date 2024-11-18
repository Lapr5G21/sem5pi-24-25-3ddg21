namespace DDDSample1.Domain.SurgeryRooms
{
    public class SurgeryRoomDto
    {
        public string Id { get; set; }
        public string RoomType { get; set; }
        public int RoomCapacity { get; set; }
        public string MaintenanceSlots { get; set; }
        public string Equipment { get; set; }
        public string Status { get; set; }
    }
}
