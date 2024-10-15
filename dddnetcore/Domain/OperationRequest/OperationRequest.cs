using System;
using System.Collections.Generic;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.Shared;


namespace DDDSample1.Domain.OperationRequest
{


public class OperationRequest : Entity<OperationRequestId>, IAggregateRoot
{
    
    public Priority PriorityLevel { get; private set;}

    public OperationType OperationType { get; private set;}

    public DeadlineDate DeadlineDate { get; private set;}


    public OperationRequest(Priority priorityLevel, OperationType operationType, DeadlineDate deadlineDate){

        this.Id = new OperationRequestId(Guid.NewGuid());
        this.PriorityLevel = priorityLevel;
        this.OperationType = operationType;
        this.DeadlineDate = deadlineDate;
    }

}

}