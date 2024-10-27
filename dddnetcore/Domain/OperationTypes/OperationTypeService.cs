using System.Threading.Tasks;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Specializations;
using DDDSample1.Domain.OperationTypesSpecializations;
using System.Linq;
using System;
using Microsoft.IdentityModel.Tokens;
using Castle.Components.DictionaryAdapter.Xml;
using DDDSample1.Domain.AuditLogs;
using Microsoft.AspNetCore.Http.HttpResults;

namespace DDDSample1.Domain.OperationTypes
{
    public class OperationTypeService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOperationTypeRepository _repo;
        private readonly ISpecializationRepository _specializationRepository;
        private readonly IOperationTypeSpecializationRepository _operationTypeSpecializationRepo;
        private readonly ILogRepository _logRepository;

        public OperationTypeService(IUnitOfWork unitOfWork, IOperationTypeRepository repo, ISpecializationRepository specializationRepository, IOperationTypeSpecializationRepository operationTypeSpecializationRepository,ILogRepository logRepository)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
            this._specializationRepository = specializationRepository;
            this._operationTypeSpecializationRepo = operationTypeSpecializationRepository;
            this._logRepository=logRepository;
        }

        public async Task<List<OperationTypeDto>> GetAllAsync()
        {
            var opTypesList = await this._repo.GetAllAsync();
            var allOperationTypeSpecializations = await _operationTypeSpecializationRepo.GetAllAsync();
            var allSpecializations = await _specializationRepository.GetAllAsync(); 
            var listDto = opTypesList.Select(op => new OperationTypeDto
            {
                Id = op.Id.AsGuid(),
                Name = op.Name.ToString(),
                EstimatedTimeDuration = op.EstimatedTimeDuration.Minutes,
                AnesthesiaTime = op.AnesthesiaTime.Minutes,
                CleaningTime = op.CleaningTime.Minutes,
                SurgeryTime = op.SurgeryTime.Minutes,
                IsActive = op.IsActive,
                Specializations = allOperationTypeSpecializations
            .Where(ots => ots.OperationType != null && ots.OperationType.Id == op.Id)
            .Select(s =>
            {
                var specialization = allSpecializations.FirstOrDefault(sp => sp.Id == s.Specialization.Id); 
                return new OperationTypeSpecializationDto
                {
                    Id = specialization != null ? specialization.Id.AsString() : "N/A", 
                    NumberOfStaff = s.NumberOfStaff.Number
                };
            }).ToList()
        }).ToList();
                return listDto;
        }

        public async Task<OperationTypeDto> GetByIdAsync(OperationTypeId id)
        {
        var op = await this._repo.GetByIdAsync(id);
    
        if (op == null)
            return null;
        

        var allOperationTypeSpecializations = await _operationTypeSpecializationRepo.GetAllAsync();
        var allSpecializations = await _specializationRepository.GetAllAsync(); 

    var operationTypeDto = new OperationTypeDto
    {
        Id = op.Id.AsGuid(),
        Name = op.Name.ToString(),
        EstimatedTimeDuration = op.EstimatedTimeDuration.Minutes,
        AnesthesiaTime = op.AnesthesiaTime.Minutes,
        CleaningTime = op.CleaningTime.Minutes,
        SurgeryTime = op.SurgeryTime.Minutes,
        IsActive = op.IsActive,
        Specializations = allOperationTypeSpecializations
            .Where(ots => ots.OperationType != null && ots.OperationType.Id == op.Id)
            .Select(s =>
            {
                var specialization = allSpecializations.FirstOrDefault(sp => sp.Id == s.Specialization.Id);
                return new OperationTypeSpecializationDto
                {
                    Id = specialization != null ? specialization.Id.AsString() : "N/A",
                    NumberOfStaff = s.NumberOfStaff.Number
                };
            }).ToList()
    };

    return operationTypeDto;
}

       public async Task<OperationTypeDto> AddAsync(CreatingOperationTypeDto dto)
        {       
            var operationType = new OperationType(
            new OperationTypeName(dto.Name),
            new EstimatedTimeDuration(dto.EstimatedTimeDuration),
            new AnesthesiaTime(dto.AnesthesiaTime),
            new CleaningTime(dto.CleaningTime),
            new SurgeryTime(dto.SurgeryTime));

            var specializations = new List<OperationTypeSpecialization>();

            await this._repo.AddAsync(operationType);

            foreach (var staffSpecialization in dto.Specializations)
            {
                var specialization = await _specializationRepository.GetByIdAsync(new SpecializationId(staffSpecialization.SpecializationId));

                if (specialization == null)
                {
                    throw new BusinessRuleValidationException($"Specialization with ID {staffSpecialization.SpecializationId} not found");
                }

                 var operationTypeSpecialization = new OperationTypeSpecialization(
                operationType,
                specialization,
                new NumberOfStaff(staffSpecialization.NumberOfStaff)
                );

                await _operationTypeSpecializationRepo.AddAsync(operationTypeSpecialization);
                specializations.Add(operationTypeSpecialization);
            }

            await this._unitOfWork.CommitAsync();

            return new OperationTypeDto
            {
            Id = operationType.Id.AsGuid(),
            Name = operationType.Name.ToString(),
            EstimatedTimeDuration = operationType.EstimatedTimeDuration.Minutes,
            AnesthesiaTime = operationType.AnesthesiaTime.Minutes,
            CleaningTime = operationType.CleaningTime.Minutes,
            IsActive = operationType.IsActive,
            SurgeryTime = operationType.SurgeryTime.Minutes,
            Specializations = specializations.Select(s => new OperationTypeSpecializationDto
            {
            Id = s.Id.AsString(),
            NumberOfStaff = s.NumberOfStaff.Number
            }).ToList()
            };
        }


public async Task<OperationTypeDto> UpdateAsync(EditOperationTypeDto dto)
{
    var operationType = await this._repo.GetByIdAsync(new OperationTypeId(dto.OperationTypeId));
    var allOperationTypeSpecializations = await _operationTypeSpecializationRepo.GetAllAsync();
    var allSpecializations = await _specializationRepository.GetAllAsync(); 
    if (operationType == null)
        return null;

    if (!string.IsNullOrWhiteSpace(dto.Name))
    {
        operationType.ChangeOperationTypeName(new OperationTypeName(dto.Name));
    }

    if (dto.EstimatedTimeDuration > 0)
    {
        operationType.ChangeOperationTypeDuration(new EstimatedTimeDuration(dto.EstimatedTimeDuration));
    }

    if (dto.Specializations != null && dto.Specializations.Count > 0)
{
    foreach (var specializationDto in dto.Specializations)
    {
        var specialization = await _specializationRepository.GetByIdAsync(new SpecializationId(specializationDto.SpecializationId));

        if (specialization == null)
        {
            throw new BusinessRuleValidationException($"Specialization with ID {specializationDto.SpecializationId} not found");
        }

        var existingSpecialization = operationType.Specializations
            .FirstOrDefault(os => os.Specialization.Id.Equals(specialization.Id));

        if (existingSpecialization != null)
        {
            continue; 
        }

        var operationTypeSpecialization = new OperationTypeSpecialization(
            operationType, 
            specialization, 
            new NumberOfStaff(specializationDto.NumberOfStaff)
        );

        await _operationTypeSpecializationRepo.AddAsync(operationTypeSpecialization);
        
        operationType.Specializations.Add(operationTypeSpecialization);
    }
}
        
        await this._unitOfWork.CommitAsync();
        var log = _logRepository.LogUpdateOperation(LogCategoryType.OPERATIONTYPE, $"Operation type updated with this name :{operationType.Name}");
        await _logRepository.AddAsync(log);

        return new OperationTypeDto
            {
            Id = operationType.Id.AsGuid(),
            Name = operationType.Name.ToString(),
            EstimatedTimeDuration = operationType.EstimatedTimeDuration.Minutes,
            AnesthesiaTime = operationType.AnesthesiaTime.Minutes,
            CleaningTime = operationType.CleaningTime.Minutes,
            IsActive = operationType.IsActive,
            SurgeryTime = operationType.SurgeryTime.Minutes,
            Specializations = allOperationTypeSpecializations
            .Where(ots => ots.OperationType != null && ots.OperationType.Id == operationType.Id)
            .Select(s =>
            {
                var specialization = allSpecializations.FirstOrDefault(sp => sp.Id == s.Specialization.Id); 
                return new OperationTypeSpecializationDto
                {
                    Id = specialization != null ? specialization.Id.AsString() : "N/A", 
                    NumberOfStaff = s.NumberOfStaff.Number
                };
            }).ToList()
            };
        }



        public async Task<IEnumerable<OperationTypeDto>> SearchOperationTypesAsync(SearchOperationTypeDto searchDto)
        {
            var operationTypes = await _repo.GetAllAsync();

            var allOperationTypeSpecializations = await _operationTypeSpecializationRepo.GetAllAsync();
            var allSpecializations = await _specializationRepository.GetAllAsync();

            IEnumerable<OperationType> filteredOperationTypes = operationTypes;

            if (!string.IsNullOrEmpty(searchDto.Name))
            {
                filteredOperationTypes = filteredOperationTypes
                    .Where(o => o.Name.ToString().IndexOf(searchDto.Name, StringComparison.OrdinalIgnoreCase) >= 0);
            }

            if (searchDto.SpecializationId != Guid.Empty)
            {
                filteredOperationTypes = filteredOperationTypes
                    .Where(o => allOperationTypeSpecializations
                        .Any(ots => ots.OperationType.Id == o.Id && ots.Specialization.Id.AsGuid() == searchDto.SpecializationId));
            }

            if (searchDto.IsActive.HasValue)
            {
                filteredOperationTypes = filteredOperationTypes
                    .Where(o => o.IsActive == searchDto.IsActive.Value);
            }

            return filteredOperationTypes.Select(o => new OperationTypeDto
            {
                Id = o.Id.AsGuid(),
                Name = o.Name.ToString(),
                EstimatedTimeDuration = o.EstimatedTimeDuration.Minutes,
                AnesthesiaTime = o.AnesthesiaTime.Minutes,
                SurgeryTime = o.SurgeryTime.Minutes,
                CleaningTime = o.CleaningTime.Minutes,
                IsActive = o.IsActive,
                Specializations = allOperationTypeSpecializations
                    .Where(ots => ots.OperationType.Id == o.Id) 
                    .Select(s =>
            {
                var specialization = allSpecializations.FirstOrDefault(sp => sp.Id == s.Specialization.Id);
                return new OperationTypeSpecializationDto
                {
                    Id = specialization != null ? specialization.Id.AsString() : "N/A",
                    NumberOfStaff = s.NumberOfStaff.Number
                };
            }).ToList()
    }).ToList();
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
