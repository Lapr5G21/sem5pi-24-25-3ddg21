using System;
using System.Collections.Generic;
using DDDSample1.Domain.OperationTypes;

namespace DDDSample1.Domain.Staffs

{
    public class StaffDto
    {
        public string StaffId { get; set; }
        public string StaffFirstName { get; set; }
        public string StaffLastName { get; set; }
        public string StaffFullName { get; set; }
        public string StaffLicenseNumber { get; set; }
        public string SpecializationId { get; set; }
        public string StaffEmail { get; set; }
        public string StaffPhoneNumber { get; set; }
        public List<AvailabilitySlot> StaffAvailabilitySlots { get; set; }
        public string UserId { get; set; }
        public bool Active { get; set;}
    }

    public class StaffDtoOpType{
        public string StaffId { get; set; }
        public string Role { get; set; }
        public string Specialization{get; set;}
        public List<string> OperationTypeNames {get; set;}
    }

    public class StaffAvailabilitySlotDto{
        public AvailabilitySlotDto AvailabilitySlotDto { get; set; }
    }
}