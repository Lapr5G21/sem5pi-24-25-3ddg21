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

        public async Task<Patient> FindByEmailAsync(PatientEmail email)
        {
            return await _context.Patients.FirstOrDefaultAsync(p => p.Email.Equals(email));
        }

        public async Task<int> GetNextSequentialNumberAsync()
        {
            // Conta o número de pacientes já registrados no banco de dados
            var patientCount = await _context.Patients.CountAsync();
    
            // O próximo número sequencial será o total de pacientes + 1
            return patientCount + 1;
        }

    }
}
