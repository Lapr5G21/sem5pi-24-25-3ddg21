using System.Threading.Tasks;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Staffs;
using System.Formats.Asn1;
using Microsoft.CodeAnalysis;
using DDDSample1.Domain.OperationTypes;
using System;
using DDDSample1.Domain.OperationTypesSpecializations;
using System.Linq;

namespace DDDSample1.Domain.Specializations
{
    public class SpecializationService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISpecializationRepository _repo;
        private readonly IStaffRepository _staffRepo;
        private readonly IOperationTypeSpecializationRepository _operationTypeRepo;

        public SpecializationService(IUnitOfWork unitOfWork, ISpecializationRepository repo, IOperationTypeSpecializationRepository operationTypeRepository, IStaffRepository staffRepository)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
            this._staffRepo=staffRepository;
            this._operationTypeRepo=operationTypeRepository;
        }

        public async Task<List<SpecializationDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();
            
            List<SpecializationDto> listDto = list.ConvertAll<SpecializationDto>(spec => 
                new SpecializationDto
                {
                    Id = spec.Id.AsGuid(),
                    SpecializationName = spec.SpecializationName.ToString(),
                    SpecializationCode = spec.SpecializationCode.ToString(),
                    SpecializationDescription = spec.SpecializationDescription.ToString(),
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
                new SpecializationName(dto.SpecializationName),
                new SpecializationCode(dto.SpecializationCode),
                new SpecializationDescription(dto.SpecializationDescription)
            );

            await this._repo.AddAsync(specialization);
            await this._unitOfWork.CommitAsync();

            return new SpecializationDto
            {
                Id = specialization.Id.AsGuid(),
                SpecializationName = specialization.SpecializationName.ToString(),
                SpecializationCode = specialization.SpecializationCode.ToString(),
                SpecializationDescription = specialization.SpecializationDescription.ToString(),
            };
        }

        public async Task<SpecializationDto> UpdateAsync(SpecializationDto dto)
        {
            var specialization = await this._repo.GetByIdAsync(new SpecializationId(dto.Id));

            if (specialization == null)
                return null;

            specialization.ChangeSpecializationName(new SpecializationName(dto.SpecializationName));
            specialization.ChangeSpecializationCode(new SpecializationCode(dto.SpecializationCode));
            specialization.UpdateSpecializationDescription(new SpecializationDescription(dto.SpecializationDescription));
            
            await this._unitOfWork.CommitAsync();

            return new SpecializationDto
            {
                Id = specialization.Id.AsGuid(),
                SpecializationName = specialization.SpecializationName.ToString(),
                SpecializationCode = specialization.SpecializationCode.ToString(),
                SpecializationDescription = specialization.SpecializationDescription.ToString(),

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
                SpecializationName = specialization.SpecializationName.ToString(),
                SpecializationCode = specialization.SpecializationCode.ToString(),
                SpecializationDescription = specialization.SpecializationDescription.ToString(),
            };
        }

        public async Task<SpecializationDto> DeleteAsync(SpecializationId id)
        {
            var specialization = await this._repo.GetByIdAsync(id);

            if (specialization == null)
                return null;
            
            if(await CheckSpecializationIsAtributtedToStaff(specialization))
            {
                throw new BusinessRuleValidationException("Specialization is atributted to staff, can´t delete it");
            }

            if(await CheckSpecializationIsAtributtedToOpType(specialization))
            {
                throw new BusinessRuleValidationException("Specialization is atributted to opType, can´t delete it");
            }


            
            this._repo.Remove(specialization);
            await this._unitOfWork.CommitAsync();

            return new SpecializationDto
            {
                Id = specialization.Id.AsGuid(),
                SpecializationName = specialization.SpecializationName.ToString(),
                SpecializationCode = specialization.SpecializationCode.ToString(),
                SpecializationDescription = specialization.SpecializationDescription.ToString(),
            };
        }

        public async Task<Boolean> CheckSpecializationIsAtributtedToStaff(Specialization specialization){
            var list= await _staffRepo.CheckSpecializationIsAtributtedToStaff(specialization);
            Console.WriteLine(list.Any());
            if(list.Any()){
                return true;
            }
            return false;
        }

        public async Task<Boolean> CheckSpecializationIsAtributtedToOpType(Specialization specialization){
            var list = await _operationTypeRepo.CheckSpecializationIsAtributtedToOpType(specialization);
            if(list.Any()){
                return true;
            }
            return false;
        }
    }
}
