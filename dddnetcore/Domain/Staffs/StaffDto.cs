using System;
using System.Collections.Generic;
using DDDSample1.Domain.OperationTypesSpecializations;

namespace DDDSample1.Domain.Staffs

{
    public class StaffDto
    {
        public string StaffId { get; set; }
        public string StaffFirstName { get; set; }
        public string StaffLastName { get; set; }
        public string LicenseNumber { get; set; }
        public string SpecializationId { get; set; }
        public string StaffEmail { get; set; }
        public string StaffPhoneNumber { get; set; }
        public string StaffAvailabilitySlots { get; set; }
        public string UserId { get; set; }
    }
}