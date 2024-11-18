
using System;
using DDDSample1.Domain.OperationTypes;

namespace DDDSample1.Domain.OperationRequests
{

public class SearchOperationRequestDto{


    public String PatientMedicalRecordNumber {get; set;}

    public Guid OperationTypeId { get;  set;}

    public String Priority { get; set;}

    public String Status { get; set;}


}
}
