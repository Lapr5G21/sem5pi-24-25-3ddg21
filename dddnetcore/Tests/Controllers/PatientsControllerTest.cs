using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Controllers;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;
using Xunit;

/*
namespace DDDSample1.Tests.Controllers
{
    public class PatientsControllerTests
    {
        private readonly Mock<PatientService> _patientServiceMock;
        private readonly PatientsController _controller;

        public PatientsControllerTests()
        {
            _patientServiceMock = new Mock<PatientService>();
            _controller = new PatientsController(_patientServiceMock.Object);
        }

        [Fact]
        public async Task GetAll_ReturnsOkResult_WithListOfPatients()
        {
            // Arrange
            var patients = new List<PatientDto>
            {
                new PatientDto
                {
                    MedicalRecordNumber = "202410123456",
                    FirstName = "João",
                    LastName = "Silva",
                    BirthDate = "01/01/1990",
                    Gender = "Male",
                    Email = "joao.silva@example.com",
                    PhoneNumber = "912345678",
                    Address = "Rua 1, Lisboa",
                    EmergencyContact = "915456856",
                    Active = true
                }
            };

            _patientServiceMock.Setup(service => service.GetAllAsync()).ReturnsAsync(patients);

            // Act
            var result = await _controller.GetAll();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedPatients = Assert.IsAssignableFrom<IEnumerable<PatientDto>>(okResult.Value);
            Assert.Single(returnedPatients);
        }

        [Fact]
        public async Task GetById_ValidId_ReturnsOkResult_WithPatient()
        {
            // Arrange
            var patient = new PatientDto
            {
                MedicalRecordNumber = "202410123456",
                FirstName = "João",
                LastName = "Silva",
                BirthDate = "01/01/1990",
                Gender = "Male",
                Email = "joao.silva@example.com",
                PhoneNumber = "912345678",
                Address = "Rua 1, Lisboa",
                EmergencyContact = "915456856",
                Active = true
            };

            _patientServiceMock.Setup(service => service.GetByIdAsync(It.IsAny<PatientMedicalRecordNumber>()))
                               .ReturnsAsync(patient);

            // Act
            var result = await _controller.GetById("202410123456");

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedPatient = Assert.IsType<PatientDto>(okResult.Value);
            Assert.Equal("João", returnedPatient.FirstName);
        }

        [Fact]
        public async Task GetById_InvalidId_ReturnsNotFound()
        {
            // Arrange
            _patientServiceMock.Setup(service => service.GetByIdAsync(It.IsAny<PatientMedicalRecordNumber>()))
                               .ReturnsAsync((PatientDto)null);

            // Act
            var result = await _controller.GetById("202410123456");

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task Create_ValidDto_ReturnsCreatedAtAction()
        {
            // Arrange
            var dto = new CreatingPatientDto(
                "João",
                "Silva",
                "João Silva",
                "01/01/1990",
                PatientGender.Male,
                "joao.silva@example.com",
                "912345678",
                "Rua 1, Lisboa",
                "915456856"
            );

            var createdPatient = new PatientDto
            {
                MedicalRecordNumber = "202410123456",
                FirstName = "João",
                LastName = "Silva"
            };

            _patientServiceMock.Setup(service => service.AddAsync(dto)).ReturnsAsync(createdPatient);

            // Act
            var result = await _controller.Create(dto);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.Equal("GetById", createdResult.ActionName);
            Assert.Equal("202410123456", createdResult.RouteValues["id"]);
        }

        [Fact]
        public async Task Create_InvalidDto_ReturnsBadRequest()
        {
            // Arrange
            CreatingPatientDto dto = null;

            // Act
            var result = await _controller.Create(dto);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal("Invalid patient profile data.", badRequestResult.Value);
        }

        [Fact]
        public async Task Update_ValidDto_ReturnsOkResult()
        {
            // Arrange
            var dto = new EditingPatientDto
            {
                MedicalRecordNumber = "202410123456",
                FirstName = "João",
                LastName = "Silva"
            };

            var updatedPatient = new PatientDto
            {
                MedicalRecordNumber = "202410123456",
                FirstName = "João",
                LastName = "Silva"
            };

            _patientServiceMock.Setup(service => service.UpdateAsync(dto)).ReturnsAsync(updatedPatient);

            // Act
            var result = await _controller.Update("123456", dto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedPatient = Assert.IsType<PatientDto>(okResult.Value);
            Assert.Equal("João", returnedPatient.FirstName);
        }

        [Fact]
        public async Task Update_InvalidDto_ReturnsBadRequest()
        {
            // Arrange
            var dto = new EditingPatientDto
            {
                MedicalRecordNumber = "202410123456",
                FirstName = "João"
            };

            // Act
            var result = await _controller.Update("202410123456", dto);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal("ID mismatch.", badRequestResult.Value);
        }

        [Fact]
        public async Task HardDelete_ValidId_ReturnsOkResult()
        {
            // Arrange
            var deletedPatient = new PatientDto
            {
                MedicalRecordNumber = "202410123456",
                FirstName = "João",
                LastName = "Silva"
            };

            _patientServiceMock.Setup(service => service.DeleteAsync(It.IsAny<PatientMedicalRecordNumber>()))
                               .ReturnsAsync(deletedPatient);

            // Act
            var result = await _controller.HardDelete("202410123456");

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedPatient = Assert.IsType<PatientDto>(okResult.Value);
            Assert.Equal("João", returnedPatient.FirstName);
        }

        [Fact]
        public async Task HardDelete_InvalidId_ReturnsNotFound()
        {
            // Arrange
            _patientServiceMock.Setup(service => service.DeleteAsync(It.IsAny<PatientMedicalRecordNumber>()))
                               .ReturnsAsync((PatientDto)null);

            // Act
            var result = await _controller.HardDelete("202410123456");

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task SearchPatients_ReturnsOkResult_WithPatients()
        {
            // Arrange
            var searchDto = new SearchPatientDto
            {
                FullName = "João Silva"
            };

            var patients = new List<PatientDto>
            {
                new PatientDto
                {
                    MedicalRecordNumber = "123456",
                    FirstName = "João",
                    LastName = "Silva",
                }
            };

            _patientServiceMock.Setup(service => service.SearchPatientsAsync(searchDto)).ReturnsAsync(patients);

            // Act
            var result = await _controller.SearchPatients("João Silva", null, null, null, null, null, null);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedPatients = Assert.IsAssignableFrom<IEnumerable<PatientDto>>(okResult.Value);
            Assert.Single(returnedPatients);
        }
    }
}
*/