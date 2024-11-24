using System.Collections.Generic;
using DDDSample1.Domain.Appointments;

namespace DDDSample1.Domain.Staffs
{
    public class StaffAppointmentsDto
    {
        public string StaffID {get;set;}
        public string Day {get;set;}
        public List<AppointmentStaffDto> AppointmentsStaff {get;set;}
    }
}