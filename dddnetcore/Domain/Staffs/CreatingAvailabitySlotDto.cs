using System;
using System.Collections.Generic;
using DDDSample1.Domain.Staffs;

namespace DDDSample1.Domain.Staffs
{
    public class CreatingAvailabitySlotDto
    {
        public string StaffId { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
    }
}
