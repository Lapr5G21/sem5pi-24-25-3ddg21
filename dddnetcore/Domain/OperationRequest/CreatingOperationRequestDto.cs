
using System;
using DDDSample1.Domain.OperationTypes;

namespace DDDSample1.Domain.OperationRequest
{

public class CreatingOperationRequestDto {

public String Priority { get;set;}

public String OperationTypeId {get; set;}

public DateTime DeadlineDate {get; set;}

public String Status {get; set;}

}
}