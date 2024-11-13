using System;
using System.Collections.Generic;
using DDDSample1.Domain.Staffs;

namespace DDDSample1.Domain.Staffs
{
    public class CreatingStaffDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public string LicenseNumber { get; set; }
        public string SpecializationId { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public List<AvailabilitySlot>? StaffAvailabilitySlots { get; set; }
        public string UserId { get; set; }
    }
}
