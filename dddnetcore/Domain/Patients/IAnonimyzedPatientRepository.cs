
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients
{
    public interface IAnonimyzedPatientRepository: IRepository<AnonimyzedPatient, AnonimyzedPatientId>
    {
        public AnonimyzedPatient CreateAnonimyzedPatient(string appointmentHistoryString, string medicalRecordString);
    }
}