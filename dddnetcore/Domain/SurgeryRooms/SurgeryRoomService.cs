using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.RoomTypes;
using DDDSample1.Domain.SurgeryRooms;

namespace DDDSample1.Domain.SurgeryRooms
{
    public class SurgeryRoomService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISurgeryRoomRepository _repo;
        private readonly IRoomTypeRepository _roomTypeRepo;

        public SurgeryRoomService(IUnitOfWork unitOfWork, ISurgeryRoomRepository repo, IRoomTypeRepository roomTypeRepo)
        {
            _unitOfWork = unitOfWork;
            _repo = repo;
            _roomTypeRepo = roomTypeRepo;
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

               var roomType = await this._roomTypeRepo.GetByIdAsync(new RoomTypeCode(dto.RoomTypeCode)) ?? throw new NullReferenceException($"Room Type Not Found With That Code");

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
                RoomType = new RoomTypeDto{Code = surgeryRoom.RoomType.Id.Value, Designation = surgeryRoom.RoomType.Designation.Value, Description = surgeryRoom.RoomType.Description?.Value, IsSuitableForSurgery = surgeryRoom.RoomType.SurgerySuitability.IsSuitableForSurgery},
                RoomCapacity = surgeryRoom.RoomCapacity.Capacity, 
                MaintenanceSlots = surgeryRoom.MaintenanceSlots.MaintenanceSlots,
                Equipment = surgeryRoom.Equipment.Equipment.ToString(),
                Status = surgeryRoom.Status.ToString()
            };
        }
    }
}
