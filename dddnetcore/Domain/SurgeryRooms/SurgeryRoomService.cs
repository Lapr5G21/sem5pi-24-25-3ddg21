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

    public async Task<SurgeryRoomDto> UpdateAsync(EditingSurgeryRoomDto dto)
    {
        var surgeryRoom = await this._repo.GetByIdAsync(new SurgeryRoomNumber(dto.Id));

        if (surgeryRoom == null) throw new BusinessRuleValidationException("Surgery Room not found");

        var newRoomType = await this._roomTypeRepo.GetByIdAsync(new RoomTypeCode(dto.RoomTypeCode));


        //patient.ChangeFirstName(new PatientFirstName(dto.FirstName));
        surgeryRoom.UpdateRoomType(newRoomType);
        surgeryRoom.UpdateEquipment(new SurgeryRoomEquipment(dto.Equipment));
        surgeryRoom.UpdateMaintenanceSlots(new SurgeryRoomMaintenanceSlots(dto.MaintenanceSlots));
        surgeryRoom.UpdateRoomCapacity(new SurgeryRoomCapacity(dto.RoomCapacity));

    await this._unitOfWork.CommitAsync();

    var resultDto = MapToDto(surgeryRoom);

    return resultDto;
    
    }


    public async Task<SurgeryRoomDto> DeleteAsync(SurgeryRoomNumber id)
        {
            var surgeryRoom = await this._repo.GetByIdAsync(id);
            if (surgeryRoom == null) throw new BusinessRuleValidationException("Surgery Room not found");

            this._repo.Remove(surgeryRoom);
            await this._unitOfWork.CommitAsync();
            
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



    public async Task<IEnumerable<SurgeryRoomDto>> SearchRoomsAsync(SearchSurgeryRoomDto searchDto)
        {
            var rooms = await _repo.GetAllAsync();

            IEnumerable<SurgeryRoom> filteredRooms = rooms.AsEnumerable();

            if (!string.IsNullOrEmpty(searchDto.Id))
            {
                filteredRooms = filteredRooms.Where(o => o.Id != null && o.Id.ToString().Contains(searchDto.Id));
            }

            if (!string.IsNullOrEmpty(searchDto.RoomTypeCode))
            {
                filteredRooms = filteredRooms.Where(o => o.RoomTypeCode != null && o.RoomTypeCode.ToString().Contains(searchDto.RoomTypeCode));
            }

            if (!string.IsNullOrEmpty(searchDto.MaintenanceSlots))
            {
                filteredRooms = filteredRooms.Where(o => o.MaintenanceSlots != null && o.MaintenanceSlots.ToString().Contains(searchDto.MaintenanceSlots));
            }

            if (!string.IsNullOrEmpty(searchDto.Equipment))
            {
                filteredRooms = filteredRooms.Where(o => o.Equipment != null && o.Equipment.ToString().Contains(searchDto.Equipment));
            }


            if (!string.IsNullOrEmpty(searchDto.Status?.ToString()))
            {
                filteredRooms = filteredRooms.Where(o=> o.Status.ToString().Contains(searchDto.Status.ToString()));
            }

            return filteredRooms.Select(o => new SurgeryRoomDto
            
                {
                Id = o.Id?.Value.ToString() ?? "N/A",
                RoomType = o.RoomType != null ? new RoomTypeDto
                {
                Code = o.RoomType.Id.Value ?? "N/A",
                Designation = o.RoomType.Designation.Value ?? "N/A",
                Description = o.RoomType.Description.Value ?? "N/A"
                } : null,
                RoomCapacity = o.RoomCapacity.Capacity,
                MaintenanceSlots = o.MaintenanceSlots.MaintenanceSlots ?? "N/A",
                Equipment = o.Equipment.Equipment ?? "N/A",
                Status = o.Status.ToString() ?? "N/A"
                }).ToList();
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
