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
            return await _context.Patients.FirstOrDefaultAsync(p => p.Email.Equals(email));
        }

        public async Task<int> GetNextSequentialNumberAsync()
    {
        var currentYearMonth = DateTime.Now.ToString("yyyyMM");

        var allPatientIds = await _context.Patients
        .Select(p => p.Id.AsString()) 
        .ToListAsync(); 

        var lastPatientId = allPatientIds
        .Where(id => id.StartsWith(currentYearMonth))
        .OrderByDescending(id => id)
        .FirstOrDefault(); 

        if (lastPatientId == null)
        {
            return 1; // Retorna 1 se não houver registros
        }

        var lastSequentialNumberString = lastPatientId.Substring(8);

        if (int.TryParse(lastSequentialNumberString, out int lastSequentialNumber))
        {
            return lastSequentialNumber + 1; 
        }
    else
    {
        throw new InvalidOperationException("O número sequencial extraído não é válido."); // Lida com erro caso a conversão falhe
    }
}


    }
}
