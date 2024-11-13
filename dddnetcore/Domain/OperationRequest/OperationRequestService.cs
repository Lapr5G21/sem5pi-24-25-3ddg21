using System.Threading.Tasks;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Specializations;
using DDDSample1.Domain.OperationRequest;
using DDDSample1.Domain.OperationRequestsx;
using DDDSample1.Domain.OperationTypes;
using System;
using System.Diagnostics.CodeAnalysis;
using DDDSample1.Domain.Staffs;
using DDDSample1.Domain.Patients;
using Microsoft.AspNetCore.Routing;
using System.Linq;
using FluentAssertions;
using Microsoft.IdentityModel.Tokens;


namespace DDDSample1.Domain.OperationRequest
{

public class OperationRequestService{


private readonly IUnitOfWork _unitOfWork;
private readonly IOperationRequestRepository _repo;

private readonly IOperationTypeRepository _OperationTypeRepo;

private readonly IStaffRepository _StaffRepository;
private readonly IPatientRepository _PatientRepository;



        public OperationRequestService(IUnitOfWork unitOfWork, IOperationRequestRepository repo, IOperationTypeRepository operationTypeRepo, IStaffRepository staffRepository, IPatientRepository patientRepository)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
            this._OperationTypeRepo = operationTypeRepo;
            this._StaffRepository=staffRepository;
            this._PatientRepository=patientRepository;
        }


        public async Task<List<OperationRequestDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();
            
            List<OperationRequestDto> listDto = list.ConvertAll<OperationRequestDto>(op =>
             new OperationRequestDto
             {
                Id = op.Id.AsGuid(), 
                PriorityLevel  = op.PriorityLevel.ToString(), 
                OperationTypeId = op.OperationTypeId.AsString(),
                DeadlineDate =  op.DeadlineDate.Value,
                Status = op.Status.ToString(),
                DoctorId = op.StaffId.AsString(),
                PacientMedicalRecordNumber = op.PatientMedicalRecordNumber.AsString()
             
             });

            return listDto;
        }


        public async Task<OperationRequestDto> GetByIdAsync(OperationRequestId id)
        {
            var op = await this._repo.GetByIdAsync(id);

            
            if(op == null)
                throw new BusinessRuleValidationException("No operation request found with that ID.");

            return new OperationRequestDto
                {
                Id = op.Id.AsGuid(), 
                PriorityLevel  = op.PriorityLevel.ToString(), 
                OperationTypeId = op.OperationTypeId.ToString(),
                DeadlineDate =  op.DeadlineDate.Value,
                Status = op.Status.ToString(),
                DoctorId = op.StaffId.ToString(),
                PacientMedicalRecordNumber = op.PatientMedicalRecordNumber.ToString()
                 };
        }

        public async Task<IEnumerable<OperationRequestDto>> SearchOperationRequestAsync(SearchOperationRequestDto searchDto)
        {
            
            var operationRequests = await _repo.GetAllAsync();

            var allOperationTypes = await _OperationTypeRepo.GetAllAsync();

            IEnumerable<OperationRequest> filteredOperationRequests = operationRequests;

            if (!string.IsNullOrEmpty(searchDto.PatientMedicalRecordNumber))
            {
                filteredOperationRequests = filteredOperationRequests.Where( o => o.PatientMedicalRecordNumber.ToString().IndexOf(searchDto.PatientMedicalRecordNumber, StringComparison.OrdinalIgnoreCase) >= 0);
            }

           if (searchDto.OperationTypeId != Guid.Empty)
            {
                filteredOperationRequests = filteredOperationRequests.Where( o => allOperationTypes.Any(ots => ots.Id == o.Id));
            }

            if (!string.IsNullOrEmpty(searchDto.Status))
            {
                filteredOperationRequests = filteredOperationRequests.Where( o => o.Status.ToString().IndexOf(searchDto.Status, StringComparison.OrdinalIgnoreCase) >= 0);
            }

            if (!string.IsNullOrEmpty(searchDto.Priority))
            {
                filteredOperationRequests = filteredOperationRequests.Where( o => o.PriorityLevel.ToString().IndexOf(searchDto.Priority, StringComparison.OrdinalIgnoreCase) >= 0);
            }

            return filteredOperationRequests.Select(o => new OperationRequestDto{
                
                Id = o.Id.AsGuid(),
                PriorityLevel  = o.PriorityLevel.ToString(), 
                OperationTypeId = o.OperationTypeId.AsString(),
                DeadlineDate =  o.DeadlineDate.Value,
                Status = o.Status.ToString(),
                DoctorId = o.StaffId.AsString(),
                PacientMedicalRecordNumber = o.PatientMedicalRecordNumber.AsString()
            }).ToList();

        }

        public async Task<OperationRequestDto> AddAsync(CreatingOperationRequestDto dto)
        {
            var operationType = await _OperationTypeRepo.GetByIdAsync(new OperationTypeId(dto.OperationTypeId));

            if(operationType == null){
            throw new BusinessRuleValidationException("Operation Type doesnt exist");
            }

            var doctor = await _StaffRepository.GetByIdAsync(new StaffId(dto.DoctorId));
            
            
            if(doctor == null){
            throw new BusinessRuleValidationException("Doctor doesnt exist");
            }

            var patient = await _PatientRepository.GetByIdAsync(new PatientMedicalRecordNumber(dto.PatientId));

            if(patient == null){
            throw new BusinessRuleValidationException("Patient doesnt exist");
            }

        foreach ( var  Specialization in operationType.Specializations)
        {
            if (!Specialization.Id.Equals(doctor.SpecializationId)){
                throw new BusinessRuleValidationException("Doctor Specialization does´t match Operation Type Specialization");
            }
        }
                var priority = Enum.Parse<Priority>(dto.Priority);
                var status = Enum.Parse<Status>(dto.Status); 
                var doctorId = dto.DoctorId;
                var PatientMedicalRecordNumber= dto.PatientId;

                var operationRequest = new OperationRequest( 
                    priority,
                    new OperationTypeId(dto.OperationTypeId),
                    new DeadlineDate(dto.DeadlineDate),
                    status,
                    new StaffId(doctorId),
                    new PatientMedicalRecordNumber(PatientMedicalRecordNumber));


            await this._repo.AddAsync(operationRequest);
            await this._unitOfWork.CommitAsync();

            patient.ChangeMedicalRecord(new PatientMedicalRecord("Operation request with id "+operationRequest.Id));
            await this._unitOfWork.CommitAsync();


            return new OperationRequestDto 
            { 
                Id = operationRequest.Id.AsGuid(),
                PriorityLevel  = operationRequest.PriorityLevel.ToString(), 
                OperationTypeId = operationRequest.OperationTypeId.AsString(),
                DeadlineDate =  operationRequest.DeadlineDate.Value,
                Status = operationRequest.Status.ToString(),
                DoctorId = operationRequest.StaffId.AsString(),
                PacientMedicalRecordNumber = operationRequest.PatientMedicalRecordNumber.AsString() };
        }
        

    public async Task<OperationRequestDto> UpdateAsync(OperationRequestDto dto){
   
    var operationRequest = await this._repo.GetByIdAsync(new OperationRequestId(dto.Id));

    if (operationRequest == null){
        return null;
    }

    var priority = Enum.Parse<Priority>(dto.PriorityLevel); 
    var status = Enum.Parse<Status>(dto.Status); 

    operationRequest.ChangeOperationRequestPriority(priority); 
    operationRequest.ChangeOperationRequestDeadline(new DeadlineDate(dto.DeadlineDate)); 
    operationRequest.ChangeOperationRequestStatus(status);

    
    await this._unitOfWork.CommitAsync();

    
    return new OperationRequestDto
    { 
                Id = operationRequest.Id.AsGuid(),
                PriorityLevel  = operationRequest.PriorityLevel.ToString(), 
                OperationTypeId = operationRequest.OperationTypeId.AsString(),
                DeadlineDate =  operationRequest.DeadlineDate.Value,
                Status = operationRequest.Status.ToString(),
                DoctorId = operationRequest.StaffId.AsString(),
                PacientMedicalRecordNumber = operationRequest.PatientMedicalRecordNumber.AsString() };
    }

        

        public async Task<bool> DeleteAsync(OperationRequestId id)
        {
            var operationRequest = await this._repo.GetByIdAsync(id);


                if (operationRequest == null)
                    throw new KeyNotFoundException($"OperationRequest with ID {id} not found.");
    
                if(operationRequest.Status.ToString().Equals("Scheduled")){
                    throw new BusinessRuleValidationException("Scheduled operation requests cannot be removed.");
                }

            this._repo.Remove(operationRequest);
            await this._unitOfWork.CommitAsync();

            return true;
        }
    
}

}