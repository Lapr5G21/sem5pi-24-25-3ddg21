using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Patients;
using DDDSample1.Infrastructure.Patients;
using Microsoft.Extensions.Configuration;

namespace DDDSample1.Domain.Patients
{
    public class PatientService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPatientRepository _patientRepository;
        private readonly IConfiguration _configuration;

        public PatientService(IUnitOfWork unitOfWork, IPatientRepository userRepository, IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _patientRepository = userRepository;
            _configuration = configuration;
        }

        // Obtém todos os pacientes
        public async Task<List<PatientDto>> GetAllAsync()
        {
            var list = await this._patientRepository.GetAllAsync();
            List<PatientDto> listDto = list.ConvertAll(patient => new PatientDto
            {
                FullName = patient.FullName,
                BirthDate = patient.BirthDate,
                Gender = patient.Gender,
                Email = patient.Email,
                PhoneNumber = patient.PhoneNumber,
                EmergencyContact = patient.EmergencyContact
            });
            return listDto;
        }

    }
}
