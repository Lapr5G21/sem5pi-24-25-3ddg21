using Moq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;
using Microsoft.Extensions.Configuration;
using DDDSample1.Domain.Emails;
using DDDSample1.Domain.AuditLogs;

namespace DDDSample1.Tests.Domain.Patients
{
    public class PatientServiceTests
    {
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<IPatientRepository> _patientRepositoryMock;
        private readonly IConfiguration _configuration;
        private readonly PatientService _patientService;
        private readonly IEmailService _emailService;
        private readonly ILogRepository _logRepository;
        private readonly IAnonimyzedPatientRepository _anonimyzedPatientRepository;

        public PatientServiceTests()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _patientRepositoryMock = new Mock<IPatientRepository>();
            _emailService =null;
            _patientService = new PatientService(_unitOfWorkMock.Object, _patientRepositoryMock.Object, _configuration,_emailService,_logRepository,_anonimyzedPatientRepository);
        }

        /*
        [Fact]
        public async Task GetAllAsync_ShouldReturnListOfPatients()
        {
            // Arrange
            var patients = new List<Patient>
            {
                new Patient(new PatientMedicalRecordNumber("202310000001"), new PatientFirstName("John"), new PatientLastName("Doe"), new PatientFullName("John Doe"), new PatientBirthDate("1990"), new PatientGender("Male")), new PatientEmail("john.doe@email.com"), new PatientPhoneNumber("123456789"), null, new PatientEmergencyContact("Emergency Contact")),
                new Patient(new PatientMedicalRecordNumber("202310000002"), new PatientFirstName("Jane"), new PatientLastName("Smith"), new PatientFullName("Jane Smith"), new PatientBirthDate("1985"), new PatientGender("Female"), new PatientEmail("jane.smith@email.com"), new PatientPhoneNumber("987654321"), null, new PatientEmergencyContact("Emergency Contact 2"))
            };
            _patientRepositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(patients);

            // Act
            var result = await _patientService.GetAllAsync();

            // Assert
            Assert.Equal(2, result.Count);
            Assert.Equal("John Doe", result[0].FullName.FullName);
            Assert.Equal("jane.smith@email.com", result[1].Email.EmailString);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnPatientByMRN()
        {
            // Arrange
            var patientMrn = new PatientMedicalRecordNumber("202310000001");
            var patient = new Patient(patientMrn, new PatientFirstName("John"), new PatientLastName("Doe"), new PatientFullName("John Doe"), new PatientBirthDate(new DateTime(1990, 1, 1)), new PatientGender("Male"), new PatientEmail("john.doe@email.com"), new PatientPhoneNumber("123456789"), null, new PatientEmergencyContact("Emergency Contact"));
            _patientRepositoryMock.Setup(repo => repo.GetByIdAsync(patientMrn)).ReturnsAsync(patient);

            // Act
            var result = await _patientService.GetByIdAsync(patientMrn);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("John Doe", result.FullName.FullName);
            Assert.Equal("john.doe@email.com", result.Email.EmailString);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnNullIfPatientNotFound()
        {
            // Arrange
            var patientMrn = new PatientMedicalRecordNumber("202310000003");
            _patientRepositoryMock.Setup(repo => repo.GetByIdAsync(patientMrn)).ReturnsAsync((Patient)null);

            // Act
            var result = await _patientService.GetByIdAsync(patientMrn);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task AddAsync_ShouldAddNewPatient()
        {
            // Arrange
            var creatingPatientDto = new CreatingPatientDto
            {
                FirstName = "John",
                LastName = "Doe",
                FullName = "John Doe",
                BirthDate = "1990",
                Gender = "Male",
                Email = "john.doe@email.com",
                PhoneNumber = "123456789",
                EmergencyContact = "Emergency Contact"
            };

            var generatedMrn = new PatientMedicalRecordNumber("202310000001");
            _patientRepositoryMock.Setup(repo => repo.GetNextSequentialNumberAsync()).ReturnsAsync(1);
            _patientRepositoryMock.Setup(repo => repo.AddAsync(It.IsAny<Patient>())).Returns(Task.CompletedTask);

            // Act
            var result = await _patientService.AddAsync(creatingPatientDto);

            // Assert
            _patientRepositoryMock.Verify(repo => repo.AddAsync(It.IsAny<Patient>()), Times.Once);
            _unitOfWorkMock.Verify(uow => uow.CommitAsync(), Times.Once);
            Assert.NotNull(result);
            Assert.Equal("John Doe", result.FullName.FullName);
            Assert.Equal("202310000001", generatedMrn.ToString());
        }

        [Fact]
        public async Task UpdateAsync_ShouldUpdateExistingPatient()
        {
            // Arrange
            var patient = new Patient(new PatientMedicalRecordNumber("202310000001"), new PatientFirstName("John"), new PatientLastName("Doe"), new PatientFullName("John Doe"), new PatientBirthDate(new DateTime(1990, 1, 1)), new PatientGender("Male"), new PatientEmail("john.doe@email.com"), new PatientPhoneNumber("123456789"), null, new PatientEmergencyContact("Emergency Contact"));
            _patientRepositoryMock.Setup(repo => repo.FindByEmailAsync(It.IsAny<PatientEmail>())).ReturnsAsync(patient);

            var updateDto = new PatientDto
            {
                FullName = new PatientFullName("John Updated"),
                Email = new PatientEmail("john.updated@email.com"),
                PhoneNumber = new PatientPhoneNumber("987654321"),
                MedicalRecord = new PatientMedicalRecord("202310000001")
            };

            // Act
            var result = await _patientService.UpdateAsync(updateDto);

            // Assert
            Assert.Equal("John Updated", result.FullName.FullNameString);
            Assert.Equal("john.updated@email.com", result.Email.EmailString);
            Assert.Equal("987654321", result.PhoneNumber.PhoneNumberString);
            _unitOfWorkMock.Verify(uow => uow.CommitAsync(), Times.Once);
        }

        [Fact]
        public async Task GenerateMedicalRecordNumberAsync_ShouldGenerateValidMRN()
        {
            // Arrange
            _patientRepositoryMock.Setup(repo => repo.GetNextSequentialNumberAsync()).ReturnsAsync(1);
            
            // Act
            var result = await _patientService.GenerateMedicalRecordNumberAsync();
            
            // Assert
            var expectedYearMonth = $"{DateTime.Now.Year}{DateTime.Now.Month:D2}";
            Assert.StartsWith(expectedYearMonth, result.ToString());
            Assert.Equal(13, result.ToString().Length); // Format: YYYYMMnnnnnn
        }*/
    }
}
