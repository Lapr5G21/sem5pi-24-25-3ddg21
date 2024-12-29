using System;
using DDDSample1.Domain.Staffs;

public class AvailabilitySlotDto
{
    public string Id { get; set; }
    public DateTime Start { get; set; }
    public DateTime End { get; set; }
    public string StaffId { get; set; }

    public AvailabilitySlotDto() {}

    public AvailabilitySlotDto(AvailabilitySlot availabilitySlot) {
            this.Id = availabilitySlot.Id.AsString();
            this.Start = availabilitySlot.Start;
            this.End = availabilitySlot.End;
            this.StaffId = availabilitySlot.StaffId.ToString();
    }
}
