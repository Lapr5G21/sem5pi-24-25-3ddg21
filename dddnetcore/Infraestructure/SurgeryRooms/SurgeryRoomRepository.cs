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
    }
}