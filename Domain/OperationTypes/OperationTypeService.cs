using System.Threading.Tasks;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.OperationTypes
{
    public class OperationTypeService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOperationTypeRepository _repo;

        public OperationTypeService(IUnitOfWork unitOfWork, IOperationTypeRepository repo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
        }

        public async Task<List<OperationTypeDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();
            
            List<OperationTypeDto> listDto = list.ConvertAll<OperationTypeDto>(op => 
                new OperationTypeDto
                {
                    Id = op.Id.AsGuid(),
                    Name = op.Name.ToString(),
                    EstimatedTimeDuration = op.EstimatedTimeDuration.Minutes,
                    AnesthesiaTime = op.AnesthesiaTime.Minutes,
                    CleaningTime = op.CleaningTime.Minutes,
                    SurgeryTime = op.SurgeryTime.Minutes
                });

            return listDto;
        }

        public async Task<OperationTypeDto> GetByIdAsync(OperationTypeId id)
        {
            var op = await this._repo.GetByIdAsync(id);
            
            if(op == null)
                return null;

            return new OperationTypeDto
            {
                Id = op.Id.AsGuid(),
                Name = op.Name.ToString(),
                EstimatedTimeDuration = op.EstimatedTimeDuration.Minutes,
                AnesthesiaTime = op.AnesthesiaTime.Minutes,
                CleaningTime = op.CleaningTime.Minutes,
                SurgeryTime = op.SurgeryTime.Minutes
            };
        }

        public async Task<OperationTypeDto> AddAsync(CreatingOperationTypeDto dto)
        {
            var operationType = new OperationType(
                new OperationTypeName(dto.Name),
                new EstimatedTimeDuration(dto.EstimatedTimeDuration),
                new AnesthesiaTime(dto.AnesthesiaTime),
                new CleaningTime(dto.CleaningTime),
                new SurgeryTime(dto.SurgeryTime)
            );

            await this._repo.AddAsync(operationType);
            await this._unitOfWork.CommitAsync();

            return new OperationTypeDto
            {
                Id = operationType.Id.AsGuid(),
                Name = operationType.Name.ToString(),
                EstimatedTimeDuration = operationType.EstimatedTimeDuration.Minutes,
                AnesthesiaTime = operationType.AnesthesiaTime.Minutes,
                CleaningTime = operationType.CleaningTime.Minutes,
                SurgeryTime = operationType.SurgeryTime.Minutes
            };
        }

        public async Task<OperationTypeDto> UpdateAsync(OperationTypeDto dto)
        {
            var operationType = await this._repo.GetByIdAsync(new OperationTypeId(dto.Id));

            if (operationType == null)
                return null;

            operationType.ChangeOperationTypeName(new OperationTypeName(dto.Name));
            operationType.ChangeOperationTypeDuration(new EstimatedTimeDuration(dto.EstimatedTimeDuration));
            operationType.ChangeAnesthesiaTime(new AnesthesiaTime(dto.AnesthesiaTime));
            operationType.ChangeCleaningTime(new CleaningTime(dto.CleaningTime));
            operationType.ChangeSurgeryTime(new SurgeryTime(dto.SurgeryTime));
            
            await this._unitOfWork.CommitAsync();

            return new OperationTypeDto
            {
                Id = operationType.Id.AsGuid(),
                Name = operationType.Name.ToString(),
                EstimatedTimeDuration = operationType.EstimatedTimeDuration.Minutes,
                AnesthesiaTime = operationType.AnesthesiaTime.Minutes,
                CleaningTime = operationType.CleaningTime.Minutes,
                SurgeryTime = operationType.SurgeryTime.Minutes
            };
        }

        public async Task<OperationTypeDto> InactivateAsync(OperationTypeId id)
        {
            var operationType = await this._repo.GetByIdAsync(id);

            if (operationType == null)
                return null;

            operationType.MarkAsInative();
            
            await this._unitOfWork.CommitAsync();

            return new OperationTypeDto
            {
                Id = operationType.Id.AsGuid(),
                Name = operationType.Name.ToString(),
                EstimatedTimeDuration = operationType.EstimatedTimeDuration.Minutes,
                AnesthesiaTime = operationType.AnesthesiaTime.Minutes,
                CleaningTime = operationType.CleaningTime.Minutes,
                SurgeryTime = operationType.SurgeryTime.Minutes
            };
        }

        public async Task<OperationTypeDto> DeleteAsync(OperationTypeId id)
        {
            var operationType = await this._repo.GetByIdAsync(id);

            if (operationType == null)
                return null;

            if (operationType.IsActive)
                throw new BusinessRuleValidationException("It is not possible to delete an active operation type.");

            this._repo.Remove(operationType);
            await this._unitOfWork.CommitAsync();

            return new OperationTypeDto
            {
                Id = operationType.Id.AsGuid(),
                Name = operationType.Name.ToString(),
                EstimatedTimeDuration = operationType.EstimatedTimeDuration.Minutes,
                AnesthesiaTime = operationType.AnesthesiaTime.Minutes,
                CleaningTime = operationType.CleaningTime.Minutes,
                SurgeryTime = operationType.SurgeryTime.Minutes
            };
        }
    }
}
