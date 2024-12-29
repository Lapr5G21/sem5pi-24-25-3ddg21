using System;
using System.Collections.Generic;

namespace DDDSample1.Domain.Appointments{

    public class CreatingAppointmentDto{

        public string SurgeryRoomId {get;set;}
        public string OperationRequestId {get;set;}
        public string Date {get;set;}
        public List<string> TeamIds {get;set;}
    }
}