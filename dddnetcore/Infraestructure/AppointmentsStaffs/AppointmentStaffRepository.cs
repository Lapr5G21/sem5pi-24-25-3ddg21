using DDDSample1.Infrastructure.Shared;
using System.Threading.Tasks;
using DDDSample1.Domain.Staffs;
using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using DDDSample1.Domain.Appointments;
using DDDSample1.Domain.AppointmentsStaffs;


namespace DDDSample1.Infrastructure.AppointmentsStaffs
{
    public class AppointmentStaffRepository : BaseRepository<AppointmentStaff, AppointmentStaffId>, IAppointmentStaffRepository
    {

        private readonly DDDSample1DbContext _context;
        public AppointmentStaffRepository(DDDSample1DbContext context) : base(context.AppointmentsStaffs)
        {
            _context = context;
        }

        public async Task<bool> IsStaffAvailableAsync(StaffId staffId, DateTime start, DateTime end, Guid? excludedAppointmentId = null)
        {
            return true;
        }
    }
}