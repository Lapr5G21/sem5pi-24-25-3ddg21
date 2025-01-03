using System;
using System.Collections.Generic;
using DDDSample1.Domain.Staffs;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.AppointmentsStaffs
{
    public interface IAppointmentStaffRepository : IRepository<AppointmentStaff, AppointmentStaffId>
    {
        public Task RemoveAsync(AppointmentStaff appointmentStaff);
        public Task AddAsync(AppointmentStaff appointmentStaff);
        public Task<List<AppointmentStaff>> GetAppointmentsByStaffIdAsync(StaffId staffId);



    }
}
