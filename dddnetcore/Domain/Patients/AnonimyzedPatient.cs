using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients
{
    public class AnonimyzedPatient : Entity<AnonimyzedPatientId>, IAggregateRoot{
        public string AppointmentHistoryString;
        public string MedicalRecordString;

        private AnonimyzedPatient()
        {
        }

        public AnonimyzedPatient(string appointementString, string medicalString){
            this.Id = new AnonimyzedPatientId(new Guid());
            this.AppointmentHistoryString=appointementString;
            this.MedicalRecordString=medicalString;
        } 
    }
}