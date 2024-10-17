using System.Threading.Tasks;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Specializations;
using DDDSample1.Domain.OperationRequest;
using DDDSample1.Domain.OperationRequestsx;
using DDDSample1.Domain.OperationTypes;
using System;


namespace DDDSample1.Domain.OperationRequest
{

public class OperationRequestService{


private readonly IUnitOfWork _unitOfWork;
private readonly IOperationRequestRepository _repo;

private readonly IOperationTypeRepository _OperationTypeRepo;


        public OperationRequestService(IUnitOfWork unitOfWork, IOperationRequestRepository repo, IOperationTypeRepository operationTypeRepo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
            this._OperationTypeRepo = operationTypeRepo;
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
                Status = op.Status.ToString()
             
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
                Status = op.Status.ToString()
                 };
        }



        public async Task<OperationRequestDto> AddAsync(CreatingOperationRequestDto dto)
        {
            var operationType = await _OperationTypeRepo.GetByIdAsync(new OperationTypeId(dto.Id));
            
            
            if(operationType == null){
            throw new BusinessRuleValidationException("Operation Type doesnt exist");
            }
            
                var priority = Enum.Parse<Priority>(dto.Priority.ToUpper());
                var status = Enum.Parse<Status>(dto.Status.ToUpper()); 

                var operationRequest = new OperationRequest( 
                    priority,
                    new OperationTypeId(dto.OperationTypeId),
                    new DeadlineDate(dto.DeadlineDate),
                    status );


            await this._repo.AddAsync(operationRequest);
            await this._unitOfWork.CommitAsync();

            return new OperationRequestDto 
            { 
                Id = operationRequest.Id.AsGuid(), 
                PriorityLevel  = operationRequest.PriorityLevel.ToString(), 
                OperationTypeId = operationRequest.OperationTypeId.ToString(),
                DeadlineDate =  operationRequest.DeadlineDate.Value,
                Status = operationRequest.Status.ToString() };
        }
        


         public async Task<OperationRequestDto> UpdateAsync(OperationRequestDto dto)
{
   
    var operationRequest = await this._repo.GetByIdAsync(new OperationRequestId(dto.Id));

    if (operationRequest == null)
        return null;

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
        DeadlineDate = operationRequest.DeadlineDate.Value, 
        Status = operationRequest.Status.ToString() 
    };
}

        

         public async Task<OperationRequestDto> DeleteAsync(OperationRequestId id)
        {
            var operationRequest = await this._repo.GetByIdAsync(id); 

            if (operationRequest == null)
                return null;   
            
            this._repo.Remove(operationRequest);
            await this._unitOfWork.CommitAsync();

            return new OperationRequestDto 
            { 
               Id = operationRequest.Id.AsGuid(), 
                PriorityLevel  = operationRequest.PriorityLevel.ToString(), 
                OperationTypeId = operationRequest.OperationTypeId.ToString(),
                DeadlineDate =  operationRequest.DeadlineDate.Value,
                Status = operationRequest.Status.ToString() };
        }
    
}

}