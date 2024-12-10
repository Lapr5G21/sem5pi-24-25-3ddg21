using System;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.RoomTypes;
using DDDSample1.Infrastructure;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace DDDSample1.Infraestructure.RoomTypes
{
    public class RoomTypeRepository : BaseRepository<RoomType, RoomTypeCode>, IRoomTypeRepository
    {
        private readonly DDDSample1DbContext _context;

        public RoomTypeRepository(DDDSample1DbContext context):base(context.RoomTypes) {
            _context = context;
        }       
    }
}