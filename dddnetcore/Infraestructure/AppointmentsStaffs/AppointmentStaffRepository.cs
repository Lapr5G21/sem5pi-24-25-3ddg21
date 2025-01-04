using DDDSample1.Infrastructure.Shared;
using System.Threading.Tasks;
using System.Collections.Generic;
using DDDSample1.Domain.Staffs;
using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using DDDSample1.Domain.Appointments;
using DDDSample1.Domain.OperationRequests;
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


    public async Task<List<AppointmentStaff>> GetAppointmentsByStaffIdAsync(StaffId staffId)
    {
        return await _context.Set<AppointmentStaff>()
            .Include(obj => obj.Appointment)
            .Where(obj => obj.Staff.Id == staffId)
            .ToListAsync();
    }

    }
}