
using System;
using DDDSample1.Domain.OperationRequest;
using DDDSample1.Domain.OperationTypes;

namespace DDDSample1.Domain.OperationRequestsx
{

public class OperationRequestDto{

    public Guid Id { get; set;}

    public String PriorityLevel { get;  set;}

    public String OperationType { get;  set;}

    public String DeadlineDate { get;  set;}

    public String Status { get; set;}

    //falta doctorId 
    //falta pacientId

}
}
