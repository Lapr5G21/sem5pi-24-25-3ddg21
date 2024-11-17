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
}
}
