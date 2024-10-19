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


        public async Task<PatientDto> GetByIdAsync(PatientMedicalRecordNumber mrn)
        {
            var patient = await this._patientRepository.GetByIdAsync(mrn);
            if (patient == null) return null;

            return new PatientDto
            {
                FullName = patient.FullName,
                BirthDate = patient.BirthDate,
                Gender = patient.Gender,
                Email = patient.Email,
                PhoneNumber = patient.PhoneNumber,
                EmergencyContact = patient.EmergencyContact
            };
        }


        public async Task<PatientDto> AddAsync(CreatingPatientDto dto)
        {            
            var mrn = await GenerateMedicalRecordNumberAsync();
            
            var patient = new Patient(mrn, new PatientFirstName(dto.FirstName), new PatientLastName(dto.LastName), new PatientFullName(dto.FullName), new PatientBirthDate(dto.BirthDate), new PatientGender(dto.Gender), new PatientEmail(dto.Email), new PatientPhoneNumber(dto.PhoneNumber), null, new PatientEmergencyContact(dto.EmergencyContact));
            
            await this._patientRepository.AddAsync(patient);
            
            await this._unitOfWork.CommitAsync();

            return new PatientDto
            {
                FullName = patient.FullName,
                BirthDate = patient.BirthDate,
                Gender = patient.Gender,
                Email = patient.Email,
                PhoneNumber = patient.PhoneNumber,
                EmergencyContact = patient.EmergencyContact
            };
        }


        
        public async Task<PatientDto> UpdateAsync(PatientDto dto)
        {
            var patient = await this._patientRepository.FindByEmailAsync(dto.Email);
            if (patient == null) return null;
            patient.ChangeName(dto.FullName);
            patient.ChangeEmail(dto.Email);
            patient.ChangePhoneNumber(dto.PhoneNumber);
            patient.ChangeMedicalRecord(dto.MedicalRecord);

            await this._unitOfWork.CommitAsync();

            return new PatientDto
            {
                FullName = patient.FullName,
                Email = patient.Email,
                PhoneNumber = patient.PhoneNumber,
                MedicalRecord = patient.MedicalRecord
            };
        }






        public async Task<PatientMedicalRecordNumber> GenerateMedicalRecordNumberAsync()
        {
            var currentYear = DateTime.Now.Year;
            var currentMonth = DateTime.Now.Month;

            var sequentialNumber = await _patientRepository.GetNextSequentialNumberAsync();

            string formattedSequentialNumber = sequentialNumber.ToString("D6");

            // Formato desejado: YYYYMMnnnnnn
            string medicalRecordNumber = $"{currentYear}{currentMonth:D2}{formattedSequentialNumber}";

            return new PatientMedicalRecordNumber(medicalRecordNumber);
        }
    }
}
