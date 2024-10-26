using System.Threading.Tasks;
using DDDSample1.Domain.Patients;
using DDDSample1.Infrastructure.Shared;

namespace DDDSample1.Infrastructure.Patients
{
    public class AnonimyzedPatientRepository : BaseRepository<AnonimyzedPatient, AnonimyzedPatientId>, IAnonimyzedPatientRepository
    {
        private readonly DDDSample1DbContext _context;

        public AnonimyzedPatientRepository(DDDSample1DbContext context) : base(context.AnonimyzedPatients)
        {
            _context = context;
        }

        public AnonimyzedPatient CreateAnonimyzedPatient(string appointmentHistoryString, string medicalRecordString)
        {
            var anonimyzedPatient = new AnonimyzedPatient(appointmentHistoryString, medicalRecordString);
            return anonimyzedPatient;
        }
    }
}
