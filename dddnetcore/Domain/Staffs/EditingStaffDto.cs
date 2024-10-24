using System;
using System.Collections.Generic;

namespace DDDSample1.Domain.Staffs
{
    public class EditingStaffDto
    {
        public string StaffId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string SpecializationId { get; set; }
        public List<AvailabilitySlotDto> AvailabilitySlots { get; set; }

        public EditingStaffDto(string staffId, string firstName, string lastName, string email, string phoneNumber, string specializationId, List<AvailabilitySlotDto> availabilitySlots)
        {
            StaffId = staffId;
            FirstName = firstName;
            LastName = lastName;
            Email = email;
            PhoneNumber = phoneNumber;
            SpecializationId = specializationId;
            AvailabilitySlots = availabilitySlots ?? new List<AvailabilitySlotDto>(); // Previne NullReferenceException
        }
    }

    public class AvailabilitySlotDto
    {
        public DateTime Start { get; set; }
        public DateTime End { get; set; }

        public AvailabilitySlotDto(DateTime start, DateTime end)
        {
            Start = start;
            End = end;
        }
    }
}
