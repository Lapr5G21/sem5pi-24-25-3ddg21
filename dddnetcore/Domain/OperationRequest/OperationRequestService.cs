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
                OperationTypeId = op.OperationTypeId.ToString(),
                DeadlineDate =  op.DeadlineDate.Value,
                Status = op.Status.ToString(),
                DoctorId = op.StaffId.ToString(),
                PacientMedicalRecordNumber = op.PatientMedicalRecordNumber.ToString()
             
             });

            return listDto;
        }


        public async Task<OperationRequestDto> GetByIdAsync(OperationRequestId id)
        {
            var op = await this._repo.GetByIdAsync(id);

            
            if(op == null)
                return null;

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

    /*public async Task<OperationRequestDto> FindByPatientNameAsync(string patientName)
        {
            var operationRequest = _repo.FindByEmailAsync(new Email(email));
            if (operationRequest == null){
                    return null;
            } 

            return new SearchOperationRequestDto
            {
                PatientName = operationRequest. ,
                OperationType = operationRequest. ,
                Priority = operationRequest. ,
                Status = operationRequest. 
                
            };
        }

         public async Task<OperationRequestDto> FindByEmailAsync(string email)
        {
            var operationRequest = await this.IOperationRequestRepository.FindByEmailAsync(new Email(email));
            if (user == null) return null;

            return new SearchOperationRequestDto
            {
                Role = user.Role.ToString(),
                Username = user.Id.ToString(),
                Email = user.Email.ToString()
            };
        }

         public async Task<OperationRequestDto> FindByEmailAsync(string email)
        {
            var operationRequest = await this.IOperationRequestRepository.FindByEmailAsync(new Email(email));
            if (user == null) return null;

            return new SearchOperationRequestDto
            {
                Role = user.Role.ToString(),
                Username = user.Id.ToString(),
                Email = user.Email.ToString()
            };
        }

        */


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
        










         public async Task<OperationRequestDto> UpdateAsync(OperationRequestDto dto, StaffId authenticatedStaffId){
   
    var operationRequest = await this._repo.GetByIdAsync(new OperationRequestId(dto.Id));

     


    if (operationRequest == null){
        return null;
    }


     if (!operationRequest.StaffId.Equals(authenticatedStaffId))
    {
        throw new BusinessRuleValidationException("You are not authorized to delete this operation request.");
    }    

    var priority = Enum.Parse<Priority>(dto.PriorityLevel.ToUpper()); 
    var status = Enum.Parse<Status>(dto.Status.ToUpper()); 

    operationRequest.ChangeOperationRequestPriority(priority); 
    operationRequest.ChangeOperationRequestDeadline(new DeadlineDate(dto.DeadlineDate)); 
    operationRequest.ChangeOperationRequestStatus(status);

    
    await this._unitOfWork.CommitAsync();

    
    return new OperationRequestDto
    { 
                Id = operationRequest.Id.AsGuid(),
                PriorityLevel  = operationRequest.PriorityLevel.ToString(), 
                OperationTypeId = operationRequest.OperationTypeId.ToString(),
                DeadlineDate =  operationRequest.DeadlineDate.Value,
                Status = operationRequest.Status.ToString(),
                DoctorId = operationRequest.StaffId.ToString(),
                PacientMedicalRecordNumber = operationRequest.PatientMedicalRecordNumber.ToString() };
    }

        

        public async Task<bool> DeleteAsync(OperationRequestId id, StaffId authenticatedStaffId)
        {
            var operationRequest = await this._repo.GetByIdAsync(id);


                if (operationRequest == null)
                    throw new KeyNotFoundException($"OperationRequest with ID {id} not found.");

                     if (!operationRequest.StaffId.Equals(authenticatedStaffId))
                            {
                                throw new BusinessRuleValidationException("You are not authorized to delete this operation request.");
                            }
    
                if(operationRequest.Status.Equals("SCHEDULED")){
                    throw new BusinessRuleValidationException("Scheduled operation requests cannot be removed.");
                        }

            this._repo.Remove(operationRequest);
            await this._unitOfWork.CommitAsync();

        return true;
        }
    
}

}