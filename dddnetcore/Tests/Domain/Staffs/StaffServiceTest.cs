using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using Moq;
using DDDSample1.Domain.Staffs;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Users;
using DDDSample1.Domain.Specializations;
using Microsoft.Extensions.Configuration;
using DDDSample1.Domain.Emails;
using System.Linq;

namespace DDDSample1.Tests.Domain.Staffs
{
    public class StaffServiceTests
    {
        /*
        private readonly Mock<IStaffRepository> _staffRepositoryMock;
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<ISpecializationRepository> _specializationRepositoryMock;
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<IEmailService> _emailServiceMock;
        private readonly StaffService _staffService;

        public StaffServiceTests()
        {
            _staffRepositoryMock = new Mock<IStaffRepository>();
            _userRepositoryMock = new Mock<IUserRepository>();
            _specializationRepositoryMock = new Mock<ISpecializationRepository>();
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _emailServiceMock = new Mock<IEmailService>();
            var configMock = new Mock<IConfiguration>();

            _staffService = new StaffService(
                _unitOfWorkMock.Object, 
                _staffRepositoryMock.Object, 
                configMock.Object, 
                _specializationRepositoryMock.Object, 
                _userRepositoryMock.Object, 
                _emailServiceMock.Object);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnListOfStaffDtos()
        {
            var staffList = new List<Staff>
            {
                new Staff(
                    new StaffId("D20240001"),
                    new StaffFirstName("Joao"),
                    new StaffLastName("Oliveira"),
                    new StaffFullName("Joao Oliveira"),
                    new StaffLicenseNumber("A12345"),
                    new SpecializationId(Guid.NewGuid().ToString()),
                    new StaffEmail("joao.test@example.com"),
                    new StaffPhoneNumber("1234567890"),
                    new Username("D20240001@healthcare.com"),
                    new StaffAvailabilitySlots("[{\"Start\":\"2024-10-30T08:00:00\",\"End\":\"2024-10-30T12:00:00\"}]")
                ),
                new Staff(
                    new StaffId("D20240002"),
                    new StaffFirstName("Maria"),
                    new StaffLastName("Silva"),
                    new StaffFullName("Maria Silva"),
                    new StaffLicenseNumber("B67890"),
                    new SpecializationId(Guid.NewGuid().ToString()),
                    new StaffEmail("maria.test@example.com"),
                    new StaffPhoneNumber("0987654321"),
                    new Username("D20240002@healthcare.com"),
                    new StaffAvailabilitySlots("[{\"Start\":\"2024-10-30T14:00:00\",\"End\":\"2024-10-30T18:00:00\"}]")
                )
            };

            _staffRepositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(staffList);

            var result = await _staffService.GetAllAsync();

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Equal("D20240001", result[0].StaffId);
            Assert.Equal("Joao", result[0].StaffFirstName);
            Assert.Equal("Oliveira", result[0].StaffLastName);
            Assert.Equal("Joao Oliveira", result[0].StaffFullName);
            Assert.Equal("A12345", result[0].StaffLicenseNumber);
            Assert.Equal(staffList[0].SpecializationId.AsString(), result[0].SpecializationId);
            Assert.Equal("joao.test@example.com", result[0].StaffEmail);
            Assert.Equal("1234567890", result[0].StaffPhoneNumber);
            Assert.Equal(staffList[0].StaffAvailabilitySlots.ToString(), result[0].StaffAvailabilitySlots);
            Assert.Equal("D20240001@healthcare.com", result[0].UserId);

            Assert.Equal("D20240002", result[1].StaffId);
            Assert.Equal("Maria", result[1].StaffFirstName);
            Assert.Equal("Silva", result[1].StaffLastName);
            Assert.Equal("Maria Silva", result[1].StaffFullName);
            Assert.Equal("B67890", result[1].StaffLicenseNumber);
            Assert.Equal(staffList[1].SpecializationId.AsString(), result[1].SpecializationId);
            Assert.Equal("maria.test@example.com", result[1].StaffEmail);
            Assert.Equal("0987654321", result[1].StaffPhoneNumber);
            Assert.Equal(staffList[1].StaffAvailabilitySlots.ToString(), result[1].StaffAvailabilitySlots);
            Assert.Equal("D20240002@healthcare.com", result[1].UserId);
        }

        [Fact]
        public async Task AddAsync_ValidData_ReturnsCreatedStaffDto()
        {
            var creatingStaffDto = new CreatingStaffDto
            {
                FirstName = "Joao",
                LastName = "Oliveira",
                FullName = "Joao Oliveira",
                LicenseNumber = "A12345",
                SpecializationId = Guid.NewGuid().ToString(),
                Email = "joao.test@example.com",
                PhoneNumber = "1234567890",
                StaffAvailabilitySlots = "[{\"Start\":\"2024-10-30T08:00:00\",\"End\":\"2024-10-30T12:00:00\"}]",
                UserId = "D20240001@healthcare.com"
            };

            var expectedStaffId = new StaffId(creatingStaffDto.UserId.Split('@')[0]);
            var expectedStaff = new Staff(
                expectedStaffId,
                new StaffFirstName(creatingStaffDto.FirstName),
                new StaffLastName(creatingStaffDto.LastName),
                new StaffFullName(creatingStaffDto.FullName),
                new StaffLicenseNumber(creatingStaffDto.LicenseNumber),
                new SpecializationId(creatingStaffDto.SpecializationId),
                new StaffEmail(creatingStaffDto.Email),
                new StaffPhoneNumber(creatingStaffDto.PhoneNumber),
                new Username(creatingStaffDto.UserId),
                new StaffAvailabilitySlots(creatingStaffDto.StaffAvailabilitySlots)
            );

            _staffRepositoryMock.Setup(repo => repo.AddAsync(It.IsAny<Staff>()))
                                .ReturnsAsync(expectedStaff);
            _unitOfWorkMock.Setup(u => u.CommitAsync()).Returns(Task.FromResult(1));

            var result = await _staffService.AddAsync(creatingStaffDto);

            Assert.NotNull(result);
            Assert.Equal(expectedStaffId.Value(), result.StaffId);
            Assert.Equal(creatingStaffDto.FirstName, result.StaffFirstName);
            Assert.Equal(creatingStaffDto.LastName, result.StaffLastName);
            Assert.Equal(creatingStaffDto.FullName, result.StaffFullName);
            Assert.Equal(creatingStaffDto.LicenseNumber, result.StaffLicenseNumber);
            Assert.Equal(creatingStaffDto.SpecializationId, result.SpecializationId);
            Assert.Equal(creatingStaffDto.Email, result.StaffEmail);
            Assert.Equal(creatingStaffDto.PhoneNumber, result.StaffPhoneNumber);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnStaff_WhenStaffExists()
        {
            var staffId = new StaffId("D20240001");
            var staff = new Staff(
                staffId,
                new StaffFirstName("Joao"),
                new StaffLastName("Oliveira"),
                new StaffFullName("Joao Oliveira"),
                new StaffLicenseNumber("A12345"),
                new SpecializationId(Guid.NewGuid().ToString()),
                new StaffEmail("joao.test@example.com"),
                new StaffPhoneNumber("1234567890"),
                new Username("D20240001@healthcare.com"),
                new StaffAvailabilitySlots("[{\"Start\":\"2024-10-30T08:00:00\",\"End\":\"2024-10-30T12:00:00\"}]")
            );

            _staffRepositoryMock.Setup(repo => repo.GetByIdAsync(staffId)).ReturnsAsync(staff);

            var result = await _staffService.GetByIdAsync(staffId);

            Assert.NotNull(result);
            Assert.Equal(staffId.Value(), result.StaffId);
            Assert.Equal(staff.StaffFirstName.ToString(), result.StaffFirstName);
            Assert.Equal(staff.StaffLastName.ToString(), result.StaffLastName);
            Assert.Equal(staff.StaffFullName.ToString(), result.StaffFullName);
            Assert.Equal(staff.StaffLicenseNumber.ToString(), result.StaffLicenseNumber);
            Assert.Equal(staff.SpecializationId.ToString(), result.SpecializationId);
            Assert.Equal(staff.StaffEmail.ToString(), result.StaffEmail);
            Assert.Equal(staff.StaffPhoneNumber.ToString(), result.StaffPhoneNumber);
        }

        [Fact]
        public async Task UpdateAsync_ValidData_UpdatesStaffAndSendsEmail()
        {
            var existingStaffId = new StaffId("D20240001");
            var existingStaff = new Staff(
                existingStaffId,
                new StaffFirstName("Joao"),
                new StaffLastName("Oliveira"),
                new StaffFullName("Joao Oliveira"),
                new StaffLicenseNumber("A12345"),
                new SpecializationId(Guid.NewGuid().ToString()),
                new StaffEmail("joao.old@example.com"),
                new StaffPhoneNumber("1234567890"),
                new Username("D20240001@healthcare.com"),
                new StaffAvailabilitySlots("[{\"Start\":\"2024-10-30T08:00:00\",\"End\":\"2024-10-30T12:00:00\"}]")
            );

            var editingStaffDto = new EditingStaffDto(
                    existingStaffId.AsString(),
                    "Joao",
                    "Oliveira",
                    "Joao Oliveira",
                    "joao.new@example.com",
                    "0987654321",
                    existingStaff.SpecializationId.AsString(),
                    "[{\"Start\":\"2024-10-30T10:00:00\",\"End\":\"2024-10-30T14:00:00\"}]"
                );

            _staffRepositoryMock.Setup(repo => repo.GetByIdAsync(existingStaffId)).ReturnsAsync(existingStaff);
            _unitOfWorkMock.Setup(u => u.CommitAsync()).ReturnsAsync(1);
            _emailServiceMock.Setup(emailService => emailService.SendEmailAsync(
                It.IsAny<List<string>>(), 
                It.IsAny<string>(), 
                It.IsAny<string>())
            ).Returns(Task.CompletedTask);

            var result = await _staffService.UpdateAsync(editingStaffDto);

            Assert.NotNull(result);
            Assert.Equal(existingStaffId.AsString(), result.StaffId);
            Assert.Equal(editingStaffDto.FirstName, result.StaffFirstName);
            Assert.Equal(editingStaffDto.LastName, result.StaffLastName);
            Assert.Equal(editingStaffDto.FullName, result.StaffFullName);
            Assert.Equal(editingStaffDto.Email, result.StaffEmail);
            Assert.Equal(editingStaffDto.PhoneNumber, result.StaffPhoneNumber);
            Assert.Equal(existingStaff.StaffLicenseNumber.ToString(), result.StaffLicenseNumber);
            Assert.Equal(editingStaffDto.SpecializationId, result.SpecializationId);
            Assert.Equal(editingStaffDto.AvailabilitySlots, result.StaffAvailabilitySlots);

            _emailServiceMock.Verify(emailService => emailService.SendEmailAsync(
                It.Is<List<string>>(emails => emails.Contains("joao.new@example.com")), 
                It.IsAny<string>(), 
                It.IsAny<string>()),
                Times.Once);
        }

        [Fact]
        public async Task InactivateAsync_WhenStaffExists()
        {
            var staffId = new StaffId("D20240001");
            var staff = new Staff(
                staffId,
                new StaffFirstName("Joao"),
                new StaffLastName("Oliveira"),
                new StaffFullName("Joao Oliveira"),
                new StaffLicenseNumber("A12345"),
                new SpecializationId(Guid.NewGuid().ToString()),
                new StaffEmail("joao.test@example.com"),
                new StaffPhoneNumber("1234567890"),
                new Username("D20240001@healthcare.com"),
                new StaffAvailabilitySlots("[{\"Start\":\"2024-10-30T08:00:00\",\"End\":\"2024-10-30T12:00:00\"}]")
            );

            _staffRepositoryMock.Setup(repo => repo.GetByIdAsync(staffId)).ReturnsAsync(staff);
            _unitOfWorkMock.Setup(u => u.CommitAsync()).ReturnsAsync(1);

            var result = await _staffService.InactivateAsync(staffId);

            Assert.NotNull(result);
            Assert.Equal(staffId.AsString(), result.StaffId);
            Assert.Equal(staff.StaffFirstName.ToString(), result.StaffFirstName);
            Assert.Equal(staff.StaffLastName.ToString(), result.StaffLastName);
            Assert.Equal(staff.StaffFullName.ToString(), result.StaffFullName);
            Assert.Equal(staff.StaffLicenseNumber.ToString(), result.StaffLicenseNumber);
            Assert.Equal(staff.SpecializationId.AsString(), result.SpecializationId);
            Assert.Equal(staff.StaffEmail.ToString(), result.StaffEmail);
            Assert.Equal(staff.StaffPhoneNumber.ToString(), result.StaffPhoneNumber);
            Assert.Equal(staff.StaffAvailabilitySlots.Slots, result.StaffAvailabilitySlots);
            Assert.Equal(staff.UserId.ToString(), result.UserId);

            _staffRepositoryMock.Verify(repo => repo.GetByIdAsync(staffId), Times.Once);
            _unitOfWorkMock.Verify(u => u.CommitAsync(), Times.Once);
        }

        [Fact]
        public async Task DeleteAsync_WhenStaffExists()
        {
            var staffId = new StaffId("D20240001");
            var staff = new Staff(
                staffId,
                new StaffFirstName("Joao"),
                new StaffLastName("Oliveira"),
                new StaffFullName("Joao Oliveira"),
                new StaffLicenseNumber("A12345"),
                new SpecializationId(Guid.NewGuid().ToString()),
                new StaffEmail("joao.test@example.com"),
                new StaffPhoneNumber("1234567890"),
                new Username("D20240001@healthcare.com"),
                new StaffAvailabilitySlots("[{\"Start\":\"2024-10-30T08:00:00\",\"End\":\"2024-10-30T12:00:00\"}]")
            );

            _staffRepositoryMock.Setup(repo => repo.GetByIdAsync(staffId)).ReturnsAsync(staff);
            _unitOfWorkMock.Setup(u => u.CommitAsync()).ReturnsAsync(1);

            var result = await _staffService.DeleteAsync(staffId);

            Assert.NotNull(result);
            Assert.Equal(staffId.AsString(), result.StaffId);
            Assert.Equal(staff.StaffFirstName.ToString(), result.StaffFirstName);
            Assert.Equal(staff.StaffLastName.ToString(), result.StaffLastName);
            Assert.Equal(staff.StaffFullName.ToString(), result.StaffFullName);
            Assert.Equal(staff.StaffLicenseNumber.ToString(), result.StaffLicenseNumber);
            Assert.Equal(staff.SpecializationId.AsString(), result.SpecializationId);
            Assert.Equal(staff.StaffEmail.ToString(), result.StaffEmail);
            Assert.Equal(staff.StaffPhoneNumber.ToString(), result.StaffPhoneNumber);
            Assert.Equal(staff.StaffAvailabilitySlots.Slots, result.StaffAvailabilitySlots);
            Assert.Equal(staff.UserId.ToString(), result.UserId);

            _staffRepositoryMock.Verify(repo => repo.Remove(staff), Times.Once);
            _unitOfWorkMock.Verify(u => u.CommitAsync(), Times.Once);
        }


        [Fact]
        public async Task SearchStaffAsync_WithFullNameFilter()
        {
            var searchDto = new StaffSearchDto { FullName = "Joao Oliveira" };
            var staff1 = new Staff(
                new StaffId("D20240001"),
                new StaffFirstName("Joao"),
                new StaffLastName("Oliveira"),
                new StaffFullName("Joao Oliveira"),
                new StaffLicenseNumber("A12345"),
                new SpecializationId(Guid.NewGuid().ToString()),
                new StaffEmail("joao.test@example.com"),
                new StaffPhoneNumber("1234567890"),
                new Username("D20240001@healthcare.com"),
                new StaffAvailabilitySlots("[{\"Start\":\"2024-10-30T08:00:00\",\"End\":\"2024-10-30T12:00:00\"}]")
            );

            var staff2 = new Staff(
                new StaffId("D20240002"),
                new StaffFirstName("Maria"),
                new StaffLastName("Silva"),
                new StaffFullName("Maria Silva"),
                new StaffLicenseNumber("B12345"),
                new SpecializationId(Guid.NewGuid().ToString()),
                new StaffEmail("maria.test@example.com"),
                new StaffPhoneNumber("0987654321"),
                new Username("D20240002@healthcare.com"),
                new StaffAvailabilitySlots("[{\"Start\":\"2024-10-30T08:00:00\",\"End\":\"2024-10-30T12:00:00\"}]")
            );

            _staffRepositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(new List<Staff> { staff1, staff2 });

            var result = await _staffService.SearchStaffAsync(searchDto);

            Assert.Single(result);
            Assert.Equal(staff1.Id.AsString(), result.First().StaffId);
        }

        [Fact]
        public async Task SearchStaffAsync_WithSpecializationFilter()
        {
            var specializationId = Guid.NewGuid();
            var searchDto = new StaffSearchDto { SpecializationId = specializationId };

            var staff1 = new Staff(
                new StaffId("D20240001"),
                new StaffFirstName("Joao"),
                new StaffLastName("Oliveira"),
                new StaffFullName("Joao Oliveira"),
                new StaffLicenseNumber("A12345"),
                new SpecializationId(specializationId.ToString()),
                new StaffEmail("joao.test@example.com"),
                new StaffPhoneNumber("1234567890"),
                new Username("D20240001@healthcare.com"),
                new StaffAvailabilitySlots("[{\"Start\":\"2024-10-30T08:00:00\",\"End\":\"2024-10-30T12:00:00\"}]")
            );

            var staff2 = new Staff(
                new StaffId("D20240002"),
                new StaffFirstName("Maria"),
                new StaffLastName("Silva"),
                new StaffFullName("Maria Silva"),
                new StaffLicenseNumber("B12345"),
                new SpecializationId(Guid.NewGuid().ToString()),
                new StaffEmail("maria.test@example.com"),
                new StaffPhoneNumber("0987654321"),
                new Username("D20240002@healthcare.com"),
                new StaffAvailabilitySlots("[{\"Start\":\"2024-10-30T08:00:00\",\"End\":\"2024-10-30T12:00:00\"}]")
            );

            _staffRepositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(new List<Staff> { staff1, staff2 });

            var result = await _staffService.SearchStaffAsync(searchDto);

            Assert.Single(result);
            Assert.Equal(staff1.Id.AsString(), result.First().StaffId);
        }
        */
    }
}
