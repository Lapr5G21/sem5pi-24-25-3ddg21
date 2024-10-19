using System;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;


namespace DDDSample1.Domain.Patients
{
    public interface IPatientRepository : IRepository<Patient, PatientMedicalRecordNumber>
    {

        Task<Patient> FindByEmailAsync(PatientEmail email);
        Task<int> GetNextSequentialNumberAsync();

    }
}