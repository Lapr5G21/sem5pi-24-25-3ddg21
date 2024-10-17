using System;
using System.Collections.Generic;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.OperationRequest
{


public class OperationRequest : Entity<OperationRequestId>, IAggregateRoot
{
    
    public Priority PriorityLevel { get; private set;}

    public OperationTypeId OperationTypeId { get; private set;}

    public DeadlineDate DeadlineDate { get; private set;}

    public Status Status { get; private set;}


    public OperationRequest(Priority priorityLevel, OperationTypeId operationTypeId, DeadlineDate deadlineDate, Status status){

        this.Id = new OperationRequestId (Guid.NewGuid());
        this.PriorityLevel = priorityLevel;
        this.OperationTypeId = operationTypeId;
        this.DeadlineDate = deadlineDate;
        this.Status = status;
        //falta doctor ID
        //falta patient ID
    }

    public void ChangeOperationRequestPriority(Priority priority){
           
            this.PriorityLevel = priority;
        }

    public void ChangeOperationRequestOperationTypeId(OperationTypeId operationTypeId){
            
            this.OperationTypeId = operationTypeId;
        }

    public void ChangeOperationRequestDeadline(DeadlineDate deadlineDate){
            
            this.DeadlineDate = deadlineDate;
        }

    public void ChangeOperationRequestStatus(Status status){
            
            this.Status = status;
        }


}

}