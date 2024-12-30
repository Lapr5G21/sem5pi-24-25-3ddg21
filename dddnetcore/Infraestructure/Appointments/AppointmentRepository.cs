using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.Appointments;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Staffs;
using DDDSample1.Infrastructure;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace dddnetcore.Infraestructure.Appointments
{
    public class AppointmentRepository : BaseRepository<Appointment, AppointmentId>, IAppointmentRepository 
    {
        private readonly DDDSample1DbContext _context;

        public AppointmentRepository(DDDSample1DbContext context):base(context.Appointments) {
            _context = context;
        }
        public async Task<List<Appointment>> GetAllAsync()
        {
            return await _context.Appointments
                .Include(a => a.OperationRequest)
                .Include(a => a.Room)
                .ToListAsync();
        }

         public async Task<List<Appointment>> GetByPatientIdAsync(PatientMedicalRecordNumber medicalRecordNumber)
        {
            return await _context.Appointments
                .Include(a => a.OperationRequest)
                .Include(a => a.Room)
                .Where(a => a.OperationRequest.PatientMedicalRecordNumber == medicalRecordNumber)
                .ToListAsync();
        }

        public async Task<List<Appointment>> GetByStaffIdAsync(StaffId staffId)
        {
            return await _context.Appointments
                .Include(a => a.OperationRequest)
                .Include(a => a.Room)
                .Where(a => a.OperationRequest.StaffId == staffId)
                .ToListAsync();
        }

        public new async Task<Appointment> GetByIdAsync(AppointmentId id){
            return await _context.Appointments.Include(a => a.Room)
            .Include(a => a.OperationRequest)
            .FirstOrDefaultAsync(a => a.Id == id);
        }


        
        public async Task<Appointment> UpdateAsync(Appointment appointment)
        {
            _context.Appointments.Update(appointment);
            
            await _context.SaveChangesAsync();

            return appointment;
        }

        public async Task RemoveAsync(Appointment appointment)
        {
            _context.Appointments.Remove(appointment);

            await _context.SaveChangesAsync();
        }

    }
}