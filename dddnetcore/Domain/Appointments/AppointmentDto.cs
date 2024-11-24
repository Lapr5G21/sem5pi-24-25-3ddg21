using System;
using DDDSample1.Domain.SurgeryRooms;

namespace DDDSample1.Domain.Appointments
{
    public class AppointmentDto
    {
        public Guid Id { get; set; }
        public SurgeryRoomDto SurgeryRoomDto { get; set; }
        public OperationRequestWithAllDataDto OperationRequestDto { get; set; }
        public string Status { get; set; }
        public DateTime DateAndTime { get; set; }
    }


    public class OperationRequestWithAllDataDto
    {
        public Guid Id { get; set; }
        public string DoctorId { get; set; }
        public OperationTypeDto OperationType { get; set; }
        public string MedicalRecordNumber { get; set; }
        public string Deadline { get; set; }
        public string Priority { get; set; }
        public string Status { get; set; }
    }

    public class OperationTypeDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int EstimatedDuration { get; set; }
        public int SurgeryTime { get; set; }
        public int AnesthesiaTime { get; set; }
        public int CleaningTime { get; set; }
    }

    public class AppointmentStaffDto
    {
        public Guid AppointmentId {get;set;}
        public int StartTime {get;set;}
        public int EndTime {get;set;}
    }
}
