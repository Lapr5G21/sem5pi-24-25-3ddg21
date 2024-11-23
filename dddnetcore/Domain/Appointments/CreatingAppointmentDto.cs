using System;

namespace DDDSample1.Domain.Appointments{

    public class CreatingAppointmentDto{

        public string SurgeryRoomId {get;set;}
        public string OperationRequestId {get;set;}
        public DateTime Date {get;set;}
    }
}