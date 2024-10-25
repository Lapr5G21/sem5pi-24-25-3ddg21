using System;
using System.Collections.Generic;
using System.Text.Json;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Staffs
{
    public class StaffAvailabilitySlots : IValueObject
    {

        public string Slots;

        public StaffAvailabilitySlots(String slots){
            Slots=slots;
        }

    public class AvailabilitySlot
    {

        public int StaffAvailabilitySlotsId { get; set; } 
        
        public DateTime Start { get; set; }
        public DateTime End { get; set; }

        public AvailabilitySlot(DateTime start, DateTime end)
        {
            Start = start;
            End = end;
        }
    }
    }
}
