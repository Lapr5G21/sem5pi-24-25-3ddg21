using System;
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
            return await _context.Patients.FirstOrDefaultAsync(p => p.Email.ToString().Equals(email.ToString()));
        }

        public async Task<int> GetNextSequentialNumberAsync()
        {
            // Obtém todos os registros do banco de dados que correspondem ao ano e mês atuais
            var currentYearMonth = DateTime.Now.ToString("yyyyMM");

            var patients = await _context.Patients
                .ToListAsync(); // Primeiro, traz todos os pacientes do banco de dados para a memória

            // Em seguida, aplica o filtro de StartsWith no lado do cliente
            var filteredPatients = patients
                .Where(p => p.Id.AsString().StartsWith(currentYearMonth))
                .ToList(); // Usamos ToList (síncrono) porque já estamos em memória

            // Caso não existam pacientes no mês corrente, o número sequencial começa em 1
            if (!filteredPatients.Any())
            {
                return 1;
            }

            // Extrai o maior número sequencial existente para o mês corrente
            var lastPatient = filteredPatients
                .OrderByDescending(p => p.Id.AsString()) // Ordena pelo ID em ordem decrescente
                .First();

            // Extrai os últimos 6 dígitos do número do prontuário para determinar o próximo sequencial
            var lastSequentialNumber = int.Parse(lastPatient.Id.AsString().Substring(8)); // Aqui ocorre o erro

            return lastSequentialNumber + 1;
}

    }
}
