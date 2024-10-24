
using System;
using DDDSample1.Domain.OperationRequest;
using DDDSample1.Domain.OperationTypes;

namespace DDDSample1.Domain.OperationRequestsx
{

public class SearchOperationRequestDto{

    public Guid Id { get; set;}

    public String PatientName {get; set;}

    public String OperationTypeId { get;  set;}

    public String Priority { get; set;}

    public String Status { get; set;}


}
}
