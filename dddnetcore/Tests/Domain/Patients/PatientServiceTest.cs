using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using Moq;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Emails;
using DDDSample1.Domain.AuditLogs;
using DDDSample1.Domain.Shared;


public class PatientServiceTests
{
    private readonly PatientService _patientService;
    private readonly Mock<IPatientRepository> _patientRepositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<IEmailService> _emailServiceMock;
    private readonly Mock<ILogRepository> _logRepositoryMock;

    public PatientServiceTests()
    {
        _patientRepositoryMock = new Mock<IPatientRepository>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _emailServiceMock = new Mock<IEmailService>();
        _logRepositoryMock = new Mock<ILogRepository>();

        _patientService = new PatientService(
            _unitOfWorkMock.Object,
            _patientRepositoryMock.Object,
            null,  
            _emailServiceMock.Object,
            _logRepositoryMock.Object,
            null   
        );
    }

    [Fact]
    public async Task AddAsync_ShouldReturnPatientDto_WhenPatientIsAdded()
    {
        // Arrange
        var dto = new CreatingPatientDto(
            firstName: "João",
            lastName: "Silva",
            fullName: "João Silva",
            birthDate: "1994-10-15", 
            gender: PatientGender.Male,
            email: "joao.silva@example.com",
            phoneNumber: "927654321",
            address: "Rua das Flores, 123",
            emergencyContact: "918888888"
        );
        var patient = PatientFactory.CreatePatient();

        _patientRepositoryMock.Setup(repo => repo.AddAsync(It.IsAny<Patient>()))
        .Returns(Task.FromResult(PatientFactory.CreatePatient()));

        _unitOfWorkMock.Setup(uow => uow.CommitAsync()).ReturnsAsync(1);

        var result = await _patientService.AddAsync(dto);

        Assert.NotNull(result);
        Assert.Equal("João", result.FirstName);
        Assert.Equal("Silva", result.LastName);
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnListOfPatientsDto_WhenPatientsExist()
    {
        // Arrange
        var patients = new List<Patient>
        {
            new Patient(
                new PatientMedicalRecordNumber("202410123456"),
                new PatientFirstName("João"),
                new PatientLastName("Silva"),
                new PatientFullName("João Silva"),
                new PatientBirthDate("1994-10-15"),
                PatientGender.Male,
                new PatientEmail("joao.silva@example.com"),
                new PatientPhoneNumber("926754321"),
                new PatientAddress("Rua das Flores, 123"),
                new PatientMedicalRecord("Registro Médico"),
                new PatientEmergencyContact("918888888"),
                new PatientAppointmentHistory("Histórico de consultas"))
        };

        _patientRepositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(patients);

        // Act
        var result = await _patientService.GetAllAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Single(result);
        Assert.Equal("João", result[0].FirstName);
    }

    [Fact]
    public async Task GetByIdAsync_ShouldReturnPatientDto_WhenPatientExists()
    {
        // Arrange
        var patient = new Patient(
            new PatientMedicalRecordNumber("202410123456"),
            new PatientFirstName("João"),
            new PatientLastName("Silva"),
            new PatientFullName("João Silva"),
            new PatientBirthDate("1994-10-15"),
            PatientGender.Male,
            new PatientEmail("joao.silva@example.com"),
            new PatientPhoneNumber("927865432"),
            new PatientAddress("Rua das Flores, 123"),
            new PatientMedicalRecord("Registro Médico"),
            new PatientEmergencyContact("918888888"),
            new PatientAppointmentHistory("Histórico de consultas"));

        _patientRepositoryMock.Setup(repo => repo.GetByIdAsync(It.IsAny<PatientMedicalRecordNumber>())).ReturnsAsync(patient);

        // Act
        var result = await _patientService.GetByIdAsync(new PatientMedicalRecordNumber("202410123456"));

        // Assert
        Assert.NotNull(result);
        Assert.Equal("João", result.FirstName);
    }

    [Fact]
    public async Task UpdateAsync_ShouldReturnPatientDto_WhenPatientIsUpdated()
    {
        // Arrange
        var existingPatient = new Patient(
            new PatientMedicalRecordNumber("202410123456"),
            new PatientFirstName("João"),
            new PatientLastName("Silva"),
            new PatientFullName("João Silva"),
            new PatientBirthDate("1994-10-15"),
            PatientGender.Male,
            new PatientEmail("joao.silva@example.com"),
            new PatientPhoneNumber("927865432"),
            new PatientAddress("Rua das Flores, 123"),
            new PatientMedicalRecord("Registro Médico"),
            new PatientEmergencyContact("918888888"),
            new PatientAppointmentHistory("Histórico de consultas"));

        var updateDto = new EditingPatientDto
        {
            MedicalRecordNumber = "202410231564",
            FirstName = "João Pedro",
            LastName = "Silva",
            FullName = "João Pedro Silva",
            MedicalHistory = "Histórico atualizado",
            Email = "joaopedro.silva@example.com",
            PhoneNumber = "912345678",
            Address = "Rua das Flores, 456"
        };

        _patientRepositoryMock.Setup(repo => repo.GetByIdAsync(It.IsAny<PatientMedicalRecordNumber>())).ReturnsAsync(existingPatient);
        _unitOfWorkMock.Setup(uow => uow.CommitAsync()).ReturnsAsync(1);

        // Act
        var result = await _patientService.UpdateAsync(updateDto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("João Pedro", result.FirstName);
        Assert.Equal("Silva", result.LastName);
    }


    public class PatientFactory
{
    public static Patient CreatePatient()
    {
        return new Patient(
            new PatientMedicalRecordNumber("202410123456"),
            new PatientFirstName("João"),
            new PatientLastName("Silva"),
            new PatientFullName("João Silva"),
            new PatientBirthDate("1994-10-15"),
            PatientGender.Male,
            new PatientEmail("joao.silva@example.com"),
            new PatientPhoneNumber("927654321"),
            new PatientAddress("Rua das Flores, 123"),
            new PatientMedicalRecord("Registro Médico"),
            new PatientEmergencyContact("918888888"),
            new PatientAppointmentHistory("Histórico de consultas")
        );
    }
}
}
