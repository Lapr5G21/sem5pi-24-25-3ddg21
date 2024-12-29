using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.SurgeryRooms;
using DDDSample1.Domain.Appointments;
using DDDSample1.Infrastructure;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace DDDSample1.Infraestructure.SurgeryRooms
{
    public class SurgeryRoomRepository : BaseRepository<SurgeryRoom, SurgeryRoomNumber>, ISurgeryRoomRepository
    {
        private readonly DDDSample1DbContext _context;

        public SurgeryRoomRepository(DDDSample1DbContext context):base(context.SurgeryRooms) {
            _context = context;
        }

        public new async Task<SurgeryRoom> GetByIdAsync(SurgeryRoomNumber id)
        {
            return await _context.SurgeryRooms.Include(a => a.RoomType)
            .FirstOrDefaultAsync(a => a.Id == id);
        }

        public new async Task<List<SurgeryRoom>> GetAllAsync()
        {
            return await _context.SurgeryRooms.Include(a => a.RoomType)
            .ToListAsync();
        }


        public async Task<bool> IsRoomAvailableAsync(SurgeryRoomNumber roomNumber, DateTime startTime, DateTime endTime, Guid? excludedAppointmentId = null)
        {
            var appointments = await _context.Appointments
               .Where(a => a.Room.Id == roomNumber && a.Status == AppointmentStatus.SCHEDULED)
               .Include(a => a.OperationRequest)
               .ToListAsync();

            foreach (var appointment in appointments)
            {
                if (excludedAppointmentId.HasValue && appointment.Id.AsGuid() == excludedAppointmentId.Value)
                {
                    continue;
                }

                var estimatedDuration = await _context.OperationTypes
                    .Where(ot => ot.Id == appointment.OperationRequest.OperationTypeId)
                    .Select(ot => ot.EstimatedTimeDuration.Minutes)
                    .FirstOrDefaultAsync();

                var appointmentEndTime = appointment.Date.Date.AddMinutes(estimatedDuration);
                if (appointment.Date.Date < endTime && appointmentEndTime > startTime)
                {
                    return false;
                }
            }

            return true;
        }
    }       
    }