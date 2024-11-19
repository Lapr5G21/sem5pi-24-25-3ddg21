using System;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.SurgeryRooms;

namespace DDDSample1.Domain.Appointments
{
    public class Appointment : Entity<AppointmentId>, IAggregateRoot
    {
        public SurgeryRoom Room { get; private set; }
        public OperationRequest OperationRequest { get; private set; }
        public AppointmentStatus Status { get; private set; }
        public AppointmentDate Date { get; private set; }

        private Appointment() { }

        public Appointment(SurgeryRoom room,OperationRequest operationRequest, AppointmentDate date)
        {
            this.Id = new AppointmentId(Guid.NewGuid());
            this.Room = room ?? throw new ArgumentNullException(nameof(room));
            this.OperationRequest = operationRequest ?? throw new ArgumentNullException(nameof(operationRequest));
            this.Date = date ?? throw new ArgumentNullException(nameof(date));
            this.Status = AppointmentStatus.SCHEDULED;
        }

        public override bool Equals(object obj)
        {
            if (obj == null || GetType() != obj.GetType())
                return false;

            var other = (Appointment)obj;
            return Id.Equals(other.Id);
        }

        public override int GetHashCode()
        {
            return Id.GetHashCode();
        }

        public void Cancel()
        {
            if (this.Status == AppointmentStatus.CANCELED)
                throw new InvalidOperationException("Appointment is already canceled.");
            this.Status = AppointmentStatus.CANCELED;
        }

        public void Complete()
        {
            if (this.Status == AppointmentStatus.COMPLETED)
                throw new InvalidOperationException("Appointment is already completed.");
            this.Status = AppointmentStatus.COMPLETED;
        }

        public void Reschedule(AppointmentDate newDate)
        {
            if (newDate == null)
                throw new ArgumentNullException(nameof(newDate));
            if (this.Status != AppointmentStatus.SCHEDULED)
                throw new InvalidOperationException("Only scheduled appointments can be rescheduled.");
            this.Date = newDate;
        }
    }
}