using System;
using System.Collections.Generic;
using DDDSample1.Domain.Staffs;
using DDDSample1.Domain.Appointments;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.AppointmentsStaffs
{
    public interface IAppointmentStaffRepository : IRepository<AppointmentStaff, AppointmentStaffId>
    {
        public Task<List<AppointmentStaff>> GetAppointmentsByStaffIdAsync(StaffId staffId);
        public Task<AppointmentStaff> UpdateAsync(AppointmentStaff appointmentStaff);
        public Task RemoveAsync(AppointmentStaff appointmentStaff);
        public Task<List<AppointmentStaff>> GetStaffsByAppointmentIdAsync(AppointmentId appointmentId);



    }
}
