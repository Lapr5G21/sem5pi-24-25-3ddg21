namespace DDDSample1.Domain.SurgeryRooms
{
    public class CreatingSurgeryRoomDto
    {
        public string Id { get; set; }
        public string RoomTypeCode { get; set; }
        public int RoomCapacity { get; set; }
        public string MaintenanceSlots { get; set; }
        public string Equipment { get; set; }
        public string Status { get; set; }
    }
}
