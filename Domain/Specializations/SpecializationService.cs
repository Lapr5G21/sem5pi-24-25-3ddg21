using System.Threading.Tasks;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Specializations
{
    public class SpecializationService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISpecializationRepository _repo;

        public SpecializationService(IUnitOfWork unitOfWork, ISpecializationRepository repo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
        }

        public async Task<List<SpecializationDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();
            
            List<SpecializationDto> listDto = list.ConvertAll<SpecializationDto>(spec => 
                new SpecializationDto
                {
                    Id = spec.Id.AsGuid(),
                    SpecializationName = spec.SpecializationName.ToString()
                });

            return listDto;
        }

        public async Task<SpecializationDto> GetByIdAsync(SpecializationId id)
        {
            var spec = await this._repo.GetByIdAsync(id);
            
            if(spec == null)
                return null;

            return new SpecializationDto
            {
                Id = spec.Id.AsGuid(),
                SpecializationName = spec.SpecializationName.ToString()
            };
        }

        public async Task<SpecializationDto> AddAsync(CreatingSpecializationDto dto)
        {
            var specialization = new Specialization(
                new SpecializationName(dto.SpecializationName)
            );

            await this._repo.AddAsync(specialization);
            await this._unitOfWork.CommitAsync();

            return new SpecializationDto
            {
                Id = specialization.Id.AsGuid(),
                SpecializationName = specialization.SpecializationName.ToString()
            };
        }

        public async Task<SpecializationDto> UpdateAsync(SpecializationDto dto)
        {
            var specialization = await this._repo.GetByIdAsync(new SpecializationId(dto.Id));

            if (specialization == null)
                return null;

            specialization.ChangeSpecializationName(new SpecializationName(dto.SpecializationName));
            
            await this._unitOfWork.CommitAsync();

            return new SpecializationDto
            {
                Id = specialization.Id.AsGuid(),
                SpecializationName = specialization.SpecializationName.ToString()
            };
        }

        public async Task<SpecializationDto> InactivateAsync(SpecializationId id)
        {
            var specialization = await this._repo.GetByIdAsync(id);

            if (specialization == null)
                return null;

            await this._unitOfWork.CommitAsync();

            return new SpecializationDto
            {
                Id = specialization.Id.AsGuid(),
                SpecializationName = specialization.SpecializationName.ToString()
            };
        }

        public async Task<SpecializationDto> DeleteAsync(SpecializationId id)
        {
            var specialization = await this._repo.GetByIdAsync(id);

            if (specialization == null)
                return null;
            
            this._repo.Remove(specialization);
            await this._unitOfWork.CommitAsync();

            return new SpecializationDto
            {
                Id = specialization.Id.AsGuid(),
                SpecializationName = specialization.SpecializationName.ToString()
            };
        }
    }
}
