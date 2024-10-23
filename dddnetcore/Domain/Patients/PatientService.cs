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
                FullName = patient.FullName.ToString(),
                BirthDate = patient.BirthDate.ToString(),
                Gender = patient.Gender.GenderValue.ToString(),
                Email = patient.Email.ToString(),
                PhoneNumber = patient.PhoneNumber.ToString(),
                EmergencyContact = patient.EmergencyContact.ToString()
            });
            return listDto;
        }


        public async Task<PatientDto> GetByIdAsync(PatientMedicalRecordNumber mrn)
        {
            var patient = await this._patientRepository.GetByIdAsync(mrn);
            if (patient == null) return null;

            return new PatientDto
            {
                FullName = patient.FullName.ToString(),
                BirthDate = patient.BirthDate.ToString(),
                Gender = patient.Gender.GenderValue.ToString(),
                Email = patient.Email.ToString(),
                PhoneNumber = patient.PhoneNumber.ToString(),
                EmergencyContact = patient.EmergencyContact.ToString()
            };
        }


        public async Task<PatientDto> AddAsync(CreatingPatientDto dto)
        {            
            var mrn = await GenerateMedicalRecordNumberAsync();
            Console.WriteLine(mrn);
            var genderValue = (Gender)Enum.Parse(typeof(Gender), dto.Gender, true);
            var patient = new Patient(
                mrn, 
                new PatientFirstName(dto.FirstName), 
                new PatientLastName(dto.LastName), 
                new PatientFullName(dto.FullName), 
                new PatientBirthDate(dto.BirthDate), 
                new PatientGender(genderValue), 
                new PatientEmail(dto.Email), 
                new PatientPhoneNumber(dto.PhoneNumber),
                new PatientAddress(dto.Address), 
                null, 
                new PatientEmergencyContact(dto.EmergencyContact),
                null);
            
            await this._patientRepository.AddAsync(patient);
            
            await this._unitOfWork.CommitAsync();

            return new PatientDto
            {
                MedicalRecordNumber = patient.Id.AsString(),
                FirstName = patient.FirstName.ToString(),
                LastName = patient.LastName.ToString(),
                FullName = patient.FullName.ToString(),
                BirthDate = patient.BirthDate.ToString(),
                Gender = patient.Gender.GenderValue.ToString(),
                Email = patient.Email.ToString(),
                PhoneNumber = patient.PhoneNumber.ToString(),
                Address = patient.Address.ToString(),
                EmergencyContact = patient.EmergencyContact.ToString(),
                Active = patient.Active
            };
        }


        
        public async Task<PatientDto> UpdateAsync(PatientDto dto)
        {
            var patient = await this._patientRepository.GetByIdAsync(new PatientMedicalRecordNumber(dto.MedicalRecordNumber));
            if (patient == null) return null;

            patient.ChangeFirstName(new PatientFirstName(dto.FirstName));
            patient.ChangeLastName(new PatientLastName(dto.LastName));
            patient.ChangeName(new PatientFullName(dto.FullName));
            patient.ChangeEmail(new PatientEmail(dto.Email));
            patient.ChangePhoneNumber(new PatientPhoneNumber(dto.PhoneNumber));
            patient.ChangeAddress(new PatientAddress(dto.Address));
            patient.ChangeMedicalRecord(new PatientMedicalRecord(dto.MedicalRecord));

            await this._unitOfWork.CommitAsync();

            return new PatientDto
            {
                FirstName = patient.FirstName.ToString(),
                LastName = patient.LastName.ToString(),
                FullName = patient.FullName.ToString(),
                BirthDate = patient.BirthDate.ToString(),
                Gender = patient.Gender.GenderValue.ToString(),
                Email = patient.Email.ToString(),
                PhoneNumber = patient.PhoneNumber.ToString(),
                Address = patient.Address.ToString(),
                EmergencyContact = patient.EmergencyContact.ToString(),
                Active = patient.Active
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
