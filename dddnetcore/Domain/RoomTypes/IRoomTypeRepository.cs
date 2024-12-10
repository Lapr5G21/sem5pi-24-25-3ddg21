using DDDSample1.Domain.Shared;
using DDDSample1.Domain.RoomTypes;

namespace DDDSample1.Domain.RoomTypes
{
    public interface IRoomTypeRepository : IRepository<RoomType, RoomTypeCode> {
        
    }
}