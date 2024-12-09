using System;
using DDDSample1.Domain.Staffs;
using DDDSample1.Domain.Appointments;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.AppointmentsTeams
{
    public class AppointmentStaff : Entity<AppointmentStaffId>, IAggregateRoot
    {
        public Appointment Appointment { get; private set; }
        public Staff Staff { get; private set; }

        private AppointmentStaff() { }

        public AppointmentStaff(Appointment appointment, Staff staff)
        {
            if (appointment == null) throw new ArgumentNullException(nameof(appointment));
            if (staff == null) throw new ArgumentNullException(nameof(staff));

            this.Id = new AppointmentStaffId(appointment.Id, staff.Id);
            this.Appointment = appointment;
            this.Staff = staff;
        }

        public override bool Equals(object obj)
        {
            return obj is AppointmentStaff other && Id.Equals(other.Id);
        }

        public override int GetHashCode()
        {
            return Id.GetHashCode();
        }
    }
}
