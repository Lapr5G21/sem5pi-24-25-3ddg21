using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Appointments
{
    public class AppointmentDate : IValueObject
    {
        public DateTime Date{get; private set;}

        private AppointmentDate() { }

        public AppointmentDate(DateTime date){
            this.Date = date;
        }
        public override bool Equals(object obj)
        {
            if (obj == null || GetType() != obj.GetType())
                return false;

            var other = (AppointmentDate)obj;
            return Date == other.Date;
        }

        public override int GetHashCode(){
            return Date.GetHashCode();
        }
    }
}