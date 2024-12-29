using System;
using System.Collections.Generic;
using DDDSample1.Domain.Staffs;

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

        public StaffDto() {}

        public StaffDto(Staff staff) {
            this.StaffId = staff.Id.ToString();
            this.StaffFirstName = staff.StaffFirstName.FirstNameString;
            this.StaffLastName = staff.StaffLastName.LastNameString;
            this.StaffFullName = staff.StaffFullName.FullNameString;
            this.StaffEmail = staff.StaffEmail.EmailString;
            this.StaffPhoneNumber = staff.StaffPhoneNumber.PhoneNumberString;
            this.StaffLicenseNumber = staff.StaffLicenseNumber.LicenseNumberString;
            this.StaffAvailabilitySlots = [];
            foreach (var availabilitySlot in staff.AvailabilitySlots) {
                StaffAvailabilitySlots.Add(availabilitySlot);
            }
            this.SpecializationId = staff.SpecializationId.ToString(); 
            this.UserId = staff.UserId.ToString();
            this.Active = staff.Active;
        }
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