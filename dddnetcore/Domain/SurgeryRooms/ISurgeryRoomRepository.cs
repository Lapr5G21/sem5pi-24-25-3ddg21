using System;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.SurgeryRooms;
using System.Threading.Tasks;

namespace DDDSample1.Domain.SurgeryRooms
{
    public interface ISurgeryRoomRepository : IRepository<SurgeryRoom, SurgeryRoomNumber> {
    
    Task<bool> IsRoomAvailableAsync(SurgeryRoomNumber roomNumber, DateTime startTime, DateTime endTime, Guid? excludedAppointmentId = null);

        
    }
}