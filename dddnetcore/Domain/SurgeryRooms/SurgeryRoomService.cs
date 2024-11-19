using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.SurgeryRooms
{
    public class SurgeryRoomService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISurgeryRoomRepository _repo;

        public SurgeryRoomService(IUnitOfWork unitOfWork, ISurgeryRoomRepository repo)
        {
            _unitOfWork = unitOfWork;
            _repo = repo;
        }

        public async Task<SurgeryRoomDto> GetByIdAsync(SurgeryRoomNumber id)
        {
            var surgeryRoom = await _repo.GetByIdAsync(id) 
                ?? throw new NullReferenceException($"Not Found Surgery Room with Id: {id}");

            return MapToDto(surgeryRoom);
        }

        public async Task<List<SurgeryRoomDto>> GetAllAsync()
        {
            var list = await _repo.GetAllAsync();
            return list.Select(MapToDto).ToList();
        }

        public async Task<SurgeryRoomDto> AddAsync(CreatingSurgeryRoomDto dto)
        {

                var roomType = Enum.Parse<SurgeryRoomType>(dto.RoomType);

                var status = Enum.Parse<SurgeryRoomStatus>(dto.Status);

                var surgeryRoom = new SurgeryRoom(
                    new SurgeryRoomNumber(dto.Id),
                    roomType,
                    new SurgeryRoomCapacity(dto.RoomCapacity),
                    new SurgeryRoomMaintenanceSlots(dto.MaintenanceSlots),
                    new SurgeryRoomEquipment(dto.Equipment),
                    status
                );

                await _repo.AddAsync(surgeryRoom);

                await _unitOfWork.CommitAsync();

                var resultDto = MapToDto(surgeryRoom);

                return resultDto;
            }

        private SurgeryRoomDto MapToDto(SurgeryRoom surgeryRoom)
        {
            return new SurgeryRoomDto
            {
                Id = surgeryRoom.Id.Value,
                RoomType = surgeryRoom.RoomType.ToString(),
                RoomCapacity = surgeryRoom.RoomCapacity.Capacity, 
                MaintenanceSlots = surgeryRoom.MaintenanceSlots.MaintenanceSlots,
                Equipment = surgeryRoom.Equipment.Equipment.ToString(),
                Status = surgeryRoom.Status.ToString()
            };
        }
    }
}
