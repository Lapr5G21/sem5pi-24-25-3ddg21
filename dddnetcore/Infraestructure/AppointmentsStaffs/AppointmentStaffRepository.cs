using DDDSample1.Infrastructure.Shared;
using System.Threading.Tasks;
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

public async Task<bool> IsStaffAvailableAsync(StaffId staffId, DateTime startTime, DateTime endTime, Guid? excludedAppointmentId = null)
{
    // Obter o Staff pelo ID
    var staff = await _context.Staffs
        .Include(s => s.AppointmentTeam)
        .ThenInclude(at => at.Appointment)
        .ThenInclude(a => a.OperationRequest)
        .Include(s => s.AvailabilitySlots)
        .FirstOrDefaultAsync(s => s.Id == staffId);

    if (staff == null)
    {
        throw new NullReferenceException($"Staff not found: {staffId}");
    }

    // Verificar conflitos com compromissos agendados
    foreach (var appointmentStaff in staff.AppointmentTeam)
    {
        var appointment = appointmentStaff.Appointment;
        var operationRequest = appointment.OperationRequest;

        if (excludedAppointmentId.HasValue && appointment.Id.AsGuid() == excludedAppointmentId.Value)
        {
            continue; // Ignorar o compromisso excluído
        }

        var estimatedDuration = await _context.OperationTypes
            .Where(ot => ot.Id == operationRequest.OperationTypeId)
            .Select(ot => ot.EstimatedTimeDuration.Minutes)
            .FirstOrDefaultAsync();

        var appointmentEndTime = appointment.Date.Date.AddMinutes(estimatedDuration);

        if (appointment.Date.Date < endTime && appointmentEndTime > startTime)
        {
            return false; // Conflito com outro compromisso
        }
    }

    // Verificar disponibilidade nos AvailabilitySlots
    var isAvailableInSlots = staff.AvailabilitySlots.Any(slot =>
        slot.Start <= startTime && slot.End >= endTime);

    if (!isAvailableInSlots)
    {
        return false; // Fora do horário de disponibilidade
    }

    return true; // Disponível
}


        public async Task RemoveAsync(AppointmentStaff appointmentStaff)
        {
            _context.AppointmentsStaffs.Remove(appointmentStaff);

            await _context.SaveChangesAsync();
        }

    }
}