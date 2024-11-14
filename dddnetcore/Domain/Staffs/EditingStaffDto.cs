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
        public List<AvailabilitySlot> StaffAvailabilitySlots { get; set; } // Lista de slots de disponibilidade

        public EditingStaffDto(string staffId, string firstName, string lastName, string fullName, string email, string phoneNumber, string specializationId, List<AvailabilitySlot> availabilitySlots)
        {
            StaffId = staffId;
            FirstName = firstName;
            LastName = lastName;
            FullName = fullName;
            Email = email;
            PhoneNumber = phoneNumber;
            SpecializationId = specializationId;
            StaffAvailabilitySlots = availabilitySlots ?? new List<AvailabilitySlot>(); // Evita valores nulos
        }
    }
}
