using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients
{
    public class PatientAppointmentHistory : IValueObject
{
    public string AppointmentHistoryString { get; private set; }

    public PatientAppointmentHistory(string history)
    {
        this.AppointmentHistoryString = history;
    }

        public override int GetHashCode()
    {
        return AppointmentHistoryString.GetHashCode();
    }

    public override string ToString()
    {
        return AppointmentHistoryString;
    }
}
}