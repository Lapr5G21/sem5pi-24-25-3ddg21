using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Patients;
using DDDSample1.Infrastructure.Patients;
using Microsoft.Extensions.Configuration;
using System.Linq;
using DDDSample1.Domain.Emails;
using DDDSample1.Domain.Logs;

namespace DDDSample1.Domain.Patients
{
    public class PatientService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPatientRepository _patientRepository;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        private readonly LogService _logService;

        public PatientService(IUnitOfWork unitOfWork, IPatientRepository patientRepository, IConfiguration configuration, IEmailService emailService,LogService logService)
        {
            _unitOfWork = unitOfWork;
            _patientRepository = patientRepository;
            _configuration = configuration;
            _emailService = emailService;
            _logService = logService;
        }

        // Obtém todos os pacientes
        public async Task<List<PatientDto>> GetAllAsync()
        {
            var list = await this._patientRepository.GetAllAsync();
            List<PatientDto> listDto = list.ConvertAll(patient => new PatientDto
            {
                MedicalRecordNumber = patient.Id.ToString(),
                FirstName = patient.FirstName.ToString(),
                LastName = patient.LastName.ToString(),
                FullName = patient.FullName.ToString(),
                BirthDate = patient.BirthDate.ToString(),
                Gender = patient.Gender.ToString(),
                Email = patient.Email.ToString(),
                PhoneNumber = patient.PhoneNumber.ToString(),
                Address = patient.Address.ToString(),
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
                MedicalRecordNumber = patient.Id.ToString(),
                FirstName = patient.FirstName.ToString(),
                LastName = patient.LastName.ToString(),
                FullName = patient.FullName.ToString(),
                BirthDate = patient.BirthDate.ToString(),
                Gender = patient.Gender.ToString(),
                Email = patient.Email.ToString(),
                PhoneNumber = patient.PhoneNumber.ToString(),
                Address = patient.Address.ToString(),
                EmergencyContact = patient.EmergencyContact.ToString()
            };
        }


        public async Task<PatientDto> AddAsync(CreatingPatientDto dto)
        {            
            var mrn = await GenerateMedicalRecordNumberAsync();
            Console.WriteLine(mrn);
            var patient = new Patient(
                mrn, 
                new PatientFirstName(dto.FirstName), 
                new PatientLastName(dto.LastName), 
                new PatientFullName(dto.FullName), 
                new PatientBirthDate(dto.BirthDate), 
                dto.Gender,
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
                Gender = patient.Gender.ToString(),
                Email = patient.Email.ToString(),
                PhoneNumber = patient.PhoneNumber.ToString(),
                Address = patient.Address.ToString(),
                EmergencyContact = patient.EmergencyContact.ToString(),
                Active = patient.Active
            };
        }


        
      public async Task<PatientDto> UpdateAsync(EditingPatientDto dto)
    {
        var patient = await this._patientRepository.GetByIdAsync(new PatientMedicalRecordNumber(dto.MedicalRecordNumber));

        if (patient == null) return null;

        var oldEmail = patient.Email.ToString();
        var oldPhoneNumber = patient.PhoneNumber.ToString();
        var oldFirstName = patient.FirstName.ToString();
        var oldLastName = patient.LastName.ToString();
        var oldAddress = patient.Address.ToString();
        var oldMedicalRecord  = patient.MedicalRecord?.ToString() ?? "N/A";

        patient.ChangeFirstName(new PatientFirstName(dto.FirstName));
        patient.ChangeLastName(new PatientLastName(dto.LastName));
        patient.ChangeName(new PatientFullName(dto.FullName));
        patient.ChangeMedicalRecord(new PatientMedicalRecord(dto.MedicalHistory));
        patient.ChangeEmail(new PatientEmail(dto.Email));
        patient.ChangePhoneNumber(new PatientPhoneNumber(dto.PhoneNumber));
        patient.ChangeAddress(new PatientAddress(dto.Address));

    await this._unitOfWork.CommitAsync();

    if (oldEmail != patient.Email.ToString() || oldPhoneNumber != patient.PhoneNumber.ToString())
    {
        List<string> toEmail = new List<string> { patient.Email.ToString() };
        await _emailService.SendEmailAsync(toEmail, "Your contact information has been updated.",
        "Dear " + patient.FullName.ToString() + ",\n\n" +
        "Your contact information has been successfully updated.\n\n" +
        "Thank you,\n" +
        "The HealthCare Team");
    }

    var changes = new List<string>();

    if (oldFirstName != patient.FirstName.ToString())
        changes.Add($"First Name: '{oldFirstName}' to '{patient.FirstName}'");
    if (oldLastName != patient.LastName.ToString())
        changes.Add($"Last Name: '{oldLastName}' to '{patient.LastName}'");
    if (oldEmail != patient.Email.ToString())
        changes.Add($"Email: '{oldEmail}' to '{patient.Email}'");
    if (oldPhoneNumber != patient.PhoneNumber.ToString())
        changes.Add($"Phone Number: '{oldPhoneNumber}' to '{patient.PhoneNumber}'");
    if (oldAddress != patient.Address.ToString())
        changes.Add($"Address: '{oldAddress}' to '{patient.Address}'");
    if (oldMedicalRecord != patient.MedicalRecord.ToString())
        changes.Add($"MedicalRecord: '{oldMedicalRecord}' to '{patient.MedicalRecord}'");

    var details = string.Join(", ", changes);

    await _logService.LogUpdateOperation(LogCategoryType.PATIENT_PROFILE, $"Updated Patient {patient.FullName}: {details}");

    return new PatientDto
    {
        MedicalRecordNumber = patient.Id.AsString(),
        FirstName = patient.FirstName.ToString(),
        LastName = patient.LastName.ToString(),
        FullName = patient.FullName.ToString(),
        BirthDate = patient.BirthDate.ToString(),
        Gender = patient.Gender.ToString(),
        Email = patient.Email.ToString(),
        PhoneNumber = patient.PhoneNumber.ToString(),
        MedicalRecord = patient.MedicalRecord.ToString(),
        Address = patient.Address.ToString(),
        EmergencyContact = patient.EmergencyContact.ToString(),
        Active = patient.Active
    };
}




        internal async Task<PatientDto> InactivateAsync(PatientMedicalRecordNumber mrn)
        {
            
            var patient = await this._patientRepository.GetByIdAsync(mrn);
            if (patient == null) return null;

            patient.Deactivate();
            
            await this._unitOfWork.CommitAsync();

            return new PatientDto
            {
                FirstName = patient.FirstName.ToString(),
                LastName = patient.LastName.ToString(),
                FullName = patient.FullName.ToString(),
                BirthDate = patient.BirthDate.ToString(),
                Gender = patient.Gender.ToString(),
                Email = patient.Email.ToString(),
                PhoneNumber = patient.PhoneNumber.ToString(),
                Address = patient.Address.ToString(),
                EmergencyContact = patient.EmergencyContact.ToString(),
                Active = patient.Active
            };
        }


        public async Task<PatientDto> DeleteAsync(PatientMedicalRecordNumber mrn)
        {
            var patient = await this._patientRepository.GetByIdAsync(mrn);
            if (patient == null) return null;

            this._patientRepository.Remove(patient);
            await this._unitOfWork.CommitAsync();

            return new PatientDto
            {
                MedicalRecordNumber = patient.Id.AsString(),
                FirstName = patient.FirstName.ToString(),
                LastName = patient.LastName.ToString(),
                FullName = patient.FullName.ToString(),
                BirthDate = patient.BirthDate.ToString(),
                Gender = patient.Gender.ToString(),
                Email = patient.Email.ToString(),
                PhoneNumber = patient.PhoneNumber.ToString(),
                Address = patient.Address.ToString(),
                MedicalRecord = patient.MedicalRecord.ToString(),
                EmergencyContact = patient.EmergencyContact.ToString(),
                Active = patient.Active
            };
        }

        
        public async Task<IEnumerable<PatientDto>> SearchPatientsAsync(SearchPatientDto searchDto)
        {
            var patients = await _patientRepository.GetAllAsync();

            IEnumerable<Patient> filteredPatients = patients.AsEnumerable();

            if (!string.IsNullOrEmpty(searchDto.FullName))
            {
                filteredPatients = filteredPatients.Where(o => o.FullName.ToString().Contains(searchDto.FullName));
            }
        
            if (!string.IsNullOrEmpty(searchDto.BirthDate))
            {
                filteredPatients = filteredPatients.Where(o => o.BirthDate.ToString().Contains(searchDto.BirthDate));
            }

            if (!string.IsNullOrEmpty(searchDto.Gender.ToString()))
            {
                filteredPatients = filteredPatients.Where(o => o.Gender.ToString().Contains(searchDto.Gender.ToString()));
            }

            if (!string.IsNullOrEmpty(searchDto.Email))
            {
                filteredPatients = filteredPatients.Where(o => o.Email.ToString().Contains(searchDto.Email));
            }

            if (!string.IsNullOrEmpty(searchDto.PhoneNumber))
            {
                filteredPatients = filteredPatients.Where(o => o.PhoneNumber.ToString().Contains(searchDto.PhoneNumber));
            }

            if (!string.IsNullOrEmpty(searchDto.MedicalRecordNumber))
            {
                filteredPatients = filteredPatients.Where(o => o.Id.ToString().Contains(searchDto.MedicalRecordNumber));
            }
        
            if (searchDto.Active != null)
            {
                filteredPatients = filteredPatients.Where(o => o.Active == searchDto.Active);
            }

            return patients.Select(o => new PatientDto
            {
                MedicalRecordNumber = o.Id.AsString(),
                FullName = o.FullName.ToString(),
                BirthDate = o.BirthDate.ToString(),
                Gender = o.Gender.ToString(),
                Email = o.Email.ToString(),
                PhoneNumber = o.PhoneNumber.ToString(),
                Active = o.Active
            }).ToList();
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
