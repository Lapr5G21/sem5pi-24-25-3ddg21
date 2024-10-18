using System;
using System.Collections.Generic;
using System.Text.Json;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Staffs
{
    public class StaffAvailabilitySlots : IValueObject
    {
        public List<AvailabilitySlot> Slots { get; private set; }

        public StaffAvailabilitySlots()
        {
            Slots = new List<AvailabilitySlot>();
        }

        public void AddSlot(DateTime start, DateTime end)
        {
            Slots.Add(new AvailabilitySlot(start, end));
        }

        public string SerializeSlots()
        {
            return JsonSerializer.Serialize(Slots);
        }

        public static StaffAvailabilitySlots DeserializeSlots(string json)
        {
            var slots = JsonSerializer.Deserialize<List<AvailabilitySlot>>(json);
            return new StaffAvailabilitySlots { Slots = slots ?? new List<AvailabilitySlot>() };
        }
    }

    public class AvailabilitySlot
    {
        public DateTime Start { get; set; }
        public DateTime End { get; set; }

        public AvailabilitySlot(DateTime start, DateTime end)
        {
            Start = start;
            End = end;
        }
    }
}