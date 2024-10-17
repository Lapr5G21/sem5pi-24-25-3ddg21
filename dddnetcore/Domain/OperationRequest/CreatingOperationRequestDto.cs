
using System;
using DDDSample1.Domain.OperationTypes;

namespace DDDSample1.Domain.OperationRequest
{

public class CreatingOperationRequestDto {


public Guid Id { get;set;}

public String Priority { get;set;}

public String PriorityLevel {get; set; }

public String OperationTypeId {get; set;}

public String DeadlineDate {get; set;}

public String Status {get; set;}

}
}