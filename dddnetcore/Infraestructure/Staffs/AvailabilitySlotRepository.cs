using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.Staffs;
using DDDSample1.Infrastructure;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace DDDSample1.Infrastructure.Staffs{
public class AvailabilitySlotRepository : BaseRepository<AvailabilitySlot, AvailabilitySlotId>, IAvailabilitySlotRepository
{
    private readonly DDDSample1DbContext _context;

    public AvailabilitySlotRepository(DDDSample1DbContext context) : base(context.AvailabilitySlots)
    {
        _context = context;
    }

    public async Task<List<AvailabilitySlot>> GetByStaffIdAsync(StaffId staffId)
    {
        return await _context.AvailabilitySlots
            .Where(slot => slot.StaffId == staffId)
            .ToListAsync();
    }
    
    public async Task<bool> RemoveBySlot(StaffId staffId, DateTime start, DateTime end)
    {
    var startNormalized = start.AddSeconds(-start.Second).AddMilliseconds(-start.Millisecond);
    var endNormalized = end.AddSeconds(-end.Second).AddMilliseconds(-end.Millisecond);

    var slot = await _context.AvailabilitySlots
        .FirstOrDefaultAsync(s => s.StaffId == staffId && s.Start == startNormalized && s.End == endNormalized);

    if (slot != null)
    {
        _context.AvailabilitySlots.Remove(slot);
        await _context.SaveChangesAsync();
        return true; 
    }

    return false; 
    }

    public async Task<bool> IsStaffAvailableInSlotAsync(StaffId staffId, DateTime startTime, DateTime endTime)
{
    return await _context.AvailabilitySlots
        .AnyAsync(slot => 
            slot.StaffId == staffId && 
            slot.Start <= startTime && 
            slot.End >= endTime);
}

}
}
