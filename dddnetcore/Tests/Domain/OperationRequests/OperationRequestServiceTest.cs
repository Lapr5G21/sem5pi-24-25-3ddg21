using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.OperationRequest;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Staffs;
using Moq;
using Xunit;

namespace DDDSample1.Tests.Domain.OperationRequests
{
    public class OperationRequestServiceTests
    { 
        private readonly Mock<IUnitOfWork> _mockUnitOfWork;
        private readonly Mock<IOperationRequestRepository> _mockOperationRequestRepo;
        private readonly Mock<IOperationTypeRepository> _mockOperationTypeRepo;
        private readonly Mock<IStaffRepository> _mockStaffRepo;
        private readonly Mock<IPatientRepository> _mockPatientRepo;
        private readonly OperationRequestService _service;

        public OperationRequestServiceTests()
        {
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            _mockOperationRequestRepo = new Mock<IOperationRequestRepository>();
            _mockOperationTypeRepo = new Mock<IOperationTypeRepository>();
            _mockStaffRepo = new Mock<IStaffRepository>();
            _mockPatientRepo = new Mock<IPatientRepository>();

            _service = new OperationRequestService(
                _mockUnitOfWork.Object,
                _mockOperationRequestRepo.Object,
                _mockOperationTypeRepo.Object,
                _mockStaffRepo.Object,
                _mockPatientRepo.Object
            );
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnListOfOperationRequestDtos()
        {
            var patientMedicalRecordNumberString = PatientMedicalRecordNumber.GenerateNewRecordNumber(DateTime.UtcNow, 123456);
            var patientMedicalRecordNumber = new PatientMedicalRecordNumber(patientMedicalRecordNumberString);
            // Arrange
            var operationRequests = new List<DDDSample1.Domain.OperationRequest.OperationRequest>
            {
                new DDDSample1.Domain.OperationRequest.OperationRequest(Priority.Elective, new OperationTypeId(Guid.NewGuid()), new DeadlineDate(DateTime.UtcNow.AddDays(10)), Status.onSchedule, new StaffId(Guid.NewGuid()), patientMedicalRecordNumber),
                new DDDSample1.Domain.OperationRequest.OperationRequest(Priority.Urgent, new OperationTypeId(Guid.NewGuid()), new DeadlineDate(DateTime.UtcNow.AddDays(5)), Status.Scheduled, new StaffId(Guid.NewGuid()), patientMedicalRecordNumber)
            };
            _mockOperationRequestRepo.Setup(repo => repo.GetAllAsync()).ReturnsAsync(operationRequests);

            // Act
            var result = await _service.GetAllAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Equal("Elective", result[0].PriorityLevel);
            Assert.Equal("Urgent", result[1].PriorityLevel);
        }

       [Fact]
public async Task GetByIdAsync_ShouldReturnOperationRequestDto_WhenFound()
{
    // Arrange
    var patientMedicalRecordNumberString = PatientMedicalRecordNumber.GenerateNewRecordNumber(DateTime.UtcNow, 123456);
    var patientMedicalRecordNumber = new PatientMedicalRecordNumber(patientMedicalRecordNumberString);
    var operationRequestId = new OperationRequestId(Guid.NewGuid());
    var operationRequest = new DDDSample1.Domain.OperationRequest.OperationRequest(
        Priority.Elective,
        new OperationTypeId(Guid.NewGuid()),
        new DeadlineDate(DateTime.UtcNow.AddDays(10)),
        Status.onSchedule,
        new StaffId(Guid.NewGuid()),
        patientMedicalRecordNumber
    );

    // Certifique-se de que o ID aqui é o mesmo que o do operationRequest
    _mockOperationRequestRepo.Setup(repo => repo.GetByIdAsync(operationRequestId)).ReturnsAsync(operationRequest);

    // Act
    var result = await _service.GetByIdAsync(operationRequestId);

    // Assert
    Assert.NotNull(result);
    Assert.Equal("Elective", result.PriorityLevel);
    Assert.Equal(operationRequest.DeadlineDate.Value, result.DeadlineDate);
    Assert.Equal(operationRequest.Status.ToString(), result.Status);
  
}

        [Fact]
        public async Task AddAsync_ShouldThrowException_WhenOperationTypeNotFound()
        {
            // Arrange
            var dto = new CreatingOperationRequestDto
            {
                Priority = "Elective",
                OperationTypeId = Guid.NewGuid().ToString(),
                DoctorId = Guid.NewGuid().ToString(),
                PatientId = "MRN001",
                DeadlineDate = DateTime.UtcNow.AddDays(10),
                Status = "onSchedule"
            };

            _mockOperationTypeRepo.Setup(repo => repo.GetByIdAsync(It.IsAny<OperationTypeId>())).ReturnsAsync((OperationType)null);

            // Act & Assert
            await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _service.AddAsync(dto));
        }

        [Fact]
        public async Task AddAsync()
        {
           
            var operationType = new OperationType(new OperationTypeName("HeartSurgery"), new EstimatedTimeDuration(150), new AnesthesiaTime(50), new CleaningTime(50) ,new SurgeryTime(50) );
            var dto = new CreatingOperationRequestDto
            {
                Priority = "Elective",
                OperationTypeId = operationType.Id.AsGuid().ToString(),
                DoctorId = Guid.NewGuid().ToString(),
                PatientId = "MRN001",
                DeadlineDate = DateTime.UtcNow.AddDays(10),
                Status = "onSchedule"
            };

            _mockOperationTypeRepo.Setup(repo => repo.GetByIdAsync(It.IsAny<OperationTypeId>())).ReturnsAsync(operationType);
            _mockStaffRepo.Setup(repo => repo.GetByIdAsync(It.IsAny<StaffId>())).ReturnsAsync((Staff)null);

           
            await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _service.AddAsync(dto));
        }

        [Fact]
        public async Task DeleteAsync()
        {
            
            var patientMedicalRecordNumberString = PatientMedicalRecordNumber.GenerateNewRecordNumber(DateTime.UtcNow, 123456);
            var patientMedicalRecordNumber = new PatientMedicalRecordNumber(patientMedicalRecordNumberString);
            var operationRequestId = new OperationRequestId(Guid.NewGuid());
            var staffId = new StaffId(Guid.NewGuid());
            var operationRequest = new DDDSample1.Domain.OperationRequest.OperationRequest(Priority.Elective, new OperationTypeId(Guid.NewGuid()), new DeadlineDate(DateTime.UtcNow.AddDays(10)), Status.Scheduled, staffId, patientMedicalRecordNumber);

            _mockOperationRequestRepo.Setup(repo => repo.GetByIdAsync(operationRequestId)).ReturnsAsync(operationRequest);

            await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _service.DeleteAsync(operationRequestId, new StaffId(Guid.NewGuid())));
        }
        
    }
    
}
