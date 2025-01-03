using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;


namespace DDDSample1.Domain.Staffs
{
    public interface IAvailabilitySlotRepository : IRepository<AvailabilitySlot, AvailabilitySlotId>
    {
    Task<List<AvailabilitySlot>> GetByStaffIdAsync(StaffId staffId);
    Task<bool> RemoveBySlot(StaffId staffId, DateTime start, DateTime end);
    Task<bool> IsStaffAvailableInSlotAsync(StaffId staffId, DateTime startTime, DateTime endTime);

    }

}