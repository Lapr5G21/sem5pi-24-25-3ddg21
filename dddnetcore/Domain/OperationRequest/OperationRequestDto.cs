
using System;
using DDDSample1.Domain.OperationTypes;

namespace DDDSample1.Domain.OperationRequests
{

public class OperationRequestDto{

    public Guid Id { get; set;}

    public String PriorityLevel { get;  set;}

    public String OperationTypeId { get;  set;}

    public DateTime DeadlineDate { get;  set;}

    public String Status { get; set;}

    public String DoctorId {get; set;}
    
    public String PacientMedicalRecordNumber { get; set;}

}
}
