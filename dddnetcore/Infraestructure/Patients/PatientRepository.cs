using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.Patients;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace DDDSample1.Infrastructure.Patients
{
    public class PatientRepository : BaseRepository<Patient, PatientMedicalRecordNumber>, IPatientRepository
    {
        private readonly DDDSample1DbContext _context;

        public PatientRepository(DDDSample1DbContext context) : base(context.Patients)
        {
            _context = context;
        }

        /*public async Task<Patient> FindByEmailAsync(PatientEmail email)
        {
            return await _context.Patients.FirstOrDefaultAsync(p => p.PatientEmail.Equals(email));
        }*/

    }
}
