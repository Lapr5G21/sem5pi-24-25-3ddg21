using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.RoomTypes
{
    public class RoomTypeService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IRoomTypeRepository _repo;

        public RoomTypeService(IUnitOfWork unitOfWork, IRoomTypeRepository repo)
        {
            _unitOfWork = unitOfWork;
            _repo = repo;
        }

        // Obter RoomType por ID
        public async Task<RoomTypeDto> GetByIdAsync(RoomTypeCode id)
        {
            var roomType = await _repo.GetByIdAsync(id) 
                ?? throw new NullReferenceException($"Not Found Room Type with Id: {id}");

            return MapToDto(roomType);
        }

        // Obter todos os RoomTypes
        public async Task<List<RoomTypeDto>> GetAllAsync()
        {
            var list = await _repo.GetAllAsync();
            return list.Select(MapToDto).ToList();
        }

        public async Task<RoomTypeDto> AddAsync(CreatingRoomTypeDto dto)
        {
            var roomType = new RoomType(
                new RoomTypeCode(dto.Code),
                new RoomTypeDesignation(dto.Designation), 
                new RoomTypeDescription(dto.Description), 
                new RoomTypeSurgerySuitability(dto.IsSuitableForSurgery));

            await this._repo.AddAsync(roomType);

            await this._unitOfWork.CommitAsync();

            var resultDto = MapToDto(roomType);

            return resultDto;
            
            }

        // Método de mapeamento de RoomType para RoomTypeDto
        private RoomTypeDto MapToDto(RoomType roomType)
        {
            return new RoomTypeDto{
                Code = roomType.Id.Value,               
                Designation = roomType.Designation.Value,      
                Description = roomType.Description.Value,  
                IsSuitableForSurgery = roomType.SurgerySuitability.IsSuitableForSurgery
            };
        }
    }
}
