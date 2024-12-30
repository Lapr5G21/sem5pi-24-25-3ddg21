using System;
using DDDSample1.Domain.Staffs;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.AppointmentsStaffs
{
    public interface IAppointmentStaffRepository : IRepository<AppointmentStaff, AppointmentStaffId>
    {
        Task<bool> IsStaffAvailableAsync(StaffId staffId, DateTime start, DateTime end, Guid? excludedAppointmentId = null);

        public Task RemoveAsync(AppointmentStaff appointmentStaff);

    }
}
