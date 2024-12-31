using System;

namespace DDDSample1.Domain.RoomTypes
{
    public class CreatingRoomTypeDto
    {
        public string Code { get; set; }
        public string Designation { get; set; }
        public string Description { get; set; }
        public bool IsSuitableForSurgery { get; set; }
    }
}