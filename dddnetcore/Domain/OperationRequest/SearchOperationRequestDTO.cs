
using System;
using DDDSample1.Domain.OperationRequest;
using DDDSample1.Domain.OperationTypes;

namespace DDDSample1.Domain.OperationRequestsx
{

public class SearchOperationRequestDto{


    public String PatientMedicalRecordNumber {get; set;}

    public Guid OperationTypeId { get;  set;}

    public String Priority { get; set;}

    public String Status { get; set;}


}
}
