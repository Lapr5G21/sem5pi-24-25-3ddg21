using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.Staffs;
using DDDSample1.Domain.Users;
using DDDSample1.Domain.Specializations;
using DDDSample1.Domain.Emails;
using DDDSample1.Domain.AuditLogs;
using Microsoft.Extensions.Configuration;
using Moq;
using Xunit;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Tests.Domain.Staffs
{
    public class StaffServiceTest
    {
        private readonly StaffService _staffService;
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<IStaffRepository> _staffRepositoryMock;
        private readonly Mock<IConfiguration> _configurationMock;
        private readonly Mock<ISpecializationRepository> _specializationRepositoryMock;
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IEmailService> _emailServiceMock;
        private readonly Mock<ILogRepository> _logRepositoryMock;

        private readonly List<Staff> _staffs;
        private readonly List<Specialization> _specializations;
        private readonly List<User> _users;

        public StaffServiceTest()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _staffRepositoryMock = new Mock<IStaffRepository>();
            _configurationMock = new Mock<IConfiguration>();
            _specializationRepositoryMock = new Mock<ISpecializationRepository>();
            _userRepositoryMock = new Mock<IUserRepository>();
            _emailServiceMock = new Mock<IEmailService>();
            _logRepositoryMock = new Mock<ILogRepository>();

            _staffService = new StaffService(_unitOfWorkMock.Object, _staffRepositoryMock.Object,
                                              _configurationMock.Object, _specializationRepositoryMock.Object,
                                              _userRepositoryMock.Object, _emailServiceMock.Object, 
                                              _logRepositoryMock.Object);

            _specializations = new List<Specialization>
            {
                new Specialization(new SpecializationName("Cardiology")),
                new Specialization(new SpecializationName("Neurology"))
            };

            _users = new List<User>
            {
                new User(new Role(RoleType.Doctor), new Email("joao.oliveira@test.com"),new Username("D20240001@healthcare.com")),
                new User(new Role(RoleType.Doctor), new Email("bruno.silva@test.com"),new Username("D20240002@healthcare.com")),
                new User(new Role(RoleType.Doctor), new Email("vasco.teixeira@test.com"),new Username("D20240003@healthcare.com"))
            };

            _staffs = new List<Staff>
            {
                new Staff(new StaffId("D20240001"), new StaffFirstName("Joao"), new StaffLastName("Oliveira"),
                          new StaffFullName("Joao Oliveira"), new StaffLicenseNumber("ABC123"),
                          _specializations[0].Id, new StaffEmail("joao.oliveira@test.com"),
                          new StaffPhoneNumber("937357467"), _users[0].Id, new StaffAvailabilitySlots("[{\"Start\":\"2024-12-30T14:00:00\",\"End\":\"2024-12-30T18:00:00\"}]")),
                new Staff(new StaffId("D20240002"), new StaffFirstName("Bruno"), new StaffLastName("Silva"),
                          new StaffFullName("Bruno Silva"), new StaffLicenseNumber("DEF456"),
                          _specializations[1].Id, new StaffEmail("bruno.silva@test.com"),
                          new StaffPhoneNumber("927654321"), _users[1].Id, new StaffAvailabilitySlots("[{\"Start\":\"2024-12-31T14:00:00\",\"End\":\"2024-12-31T18:00:00\"}]"))
            };
        }

        [Fact]
        public async Task GetAllAsync_ReturnsAllStaff()
        {
            _staffRepositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(_staffs);

            var result = await _staffService.GetAllAsync();

            Assert.Equal(2, result.Count);
            Assert.Equal("Joao Oliveira", result[0].StaffFullName);
            Assert.Equal("Bruno Silva", result[1].StaffFullName);
        }

        [Fact]
        public async Task GetByIdAsync_ValidId_ReturnsStaff()
        {
            var staffId = new StaffId("D20240001");
            _staffRepositoryMock.Setup(repo => repo.GetByIdAsync(staffId)).ReturnsAsync(_staffs[0]);

            var result = await _staffService.GetByIdAsync(staffId);

            Assert.NotNull(result);
            Assert.Equal("Joao Oliveira", result.StaffFullName);
        }

        [Fact]
        public async Task AddAsync_ValidDto_AddsStaff()
        {
            var creatingStaffDto = new CreatingStaffDto
            {
                UserId = _users[2].Id.ToString(),
                FirstName = "Vasco",
                LastName = "Teixeira",
                FullName = "Vasco Teixeira",
                LicenseNumber = "XYZ789",
                Email = "vasco.teixeira@test.com",
                PhoneNumber = "913876556",
                SpecializationId = _specializations[1].Id.AsString(),
                StaffAvailabilitySlots = "[{\"Start\":\"2024-12-31T22:00:00\",\"End\":\"2024-12-31T23:00:00\"}]",
            };

            _userRepositoryMock.Setup(repo => repo.GetByIdAsync(new Username(_users[2].Id.Value))).ReturnsAsync(_users[2]);
            _specializationRepositoryMock.Setup(repo => repo.GetByIdAsync(It.IsAny<SpecializationId>())).ReturnsAsync(_specializations[1]);

            var result = await _staffService.AddAsync(creatingStaffDto);

            Assert.NotNull(result);
            Assert.Equal(creatingStaffDto.FirstName, result.StaffFirstName);
            Assert.Equal(creatingStaffDto.LastName, result.StaffLastName);
            Assert.Equal(creatingStaffDto.FullName, result.StaffFullName);
            Assert.Equal(creatingStaffDto.LicenseNumber, result.StaffLicenseNumber);
            Assert.Equal(creatingStaffDto.Email, result.StaffEmail);
            Assert.Equal(creatingStaffDto.PhoneNumber, result.StaffPhoneNumber);
            Assert.Equal(creatingStaffDto.SpecializationId, result.SpecializationId);
            Assert.Equal(creatingStaffDto.StaffAvailabilitySlots, result.StaffAvailabilitySlots);
            Assert.Equal(creatingStaffDto.UserId, result.UserId);

            _userRepositoryMock.Verify(repo => repo.GetByIdAsync(new Username(_users[2].Id.Value)), Times.Once);
            _specializationRepositoryMock.Verify(repo => repo.GetByIdAsync(It.IsAny<SpecializationId>()), Times.Once);
            _staffRepositoryMock.Verify(repo => repo.AddAsync(It.IsAny<Staff>()), Times.Once);
            _unitOfWorkMock.Verify(uow => uow.CommitAsync(), Times.Once);
        }

        [Fact]
        public async Task AddAsync_ShouldThrowException_WhenUserNotFound()
        {
            var creatingStaffDto = new CreatingStaffDto
            {
                UserId = "D20240004@healthcare.com",
                FirstName = "Eduardo",
                LastName = "Ferreira",
                FullName = "Eduardo Ferreira",
                LicenseNumber = "XYZ767",
                Email = "eduardo.ferreira@test.com",
                PhoneNumber = "917654543",
                SpecializationId = _specializations[1].Id.AsString(),
                StaffAvailabilitySlots = "[{\"Start\":\"2024-12-28T22:00:00\",\"End\":\"2024-12-28T23:00:00\"}]",
            };

            _userRepositoryMock.Setup(repo => repo.GetByIdAsync(It.IsAny<Username>())).ReturnsAsync((User)null);
            _specializationRepositoryMock.Setup(repo => repo.GetByIdAsync(It.IsAny<SpecializationId>())).ReturnsAsync(_specializations[1]);

            await Assert.ThrowsAsync<InvalidOperationException>(() => _staffService.AddAsync(creatingStaffDto));
        }

        [Fact]
        public async Task UpdateAsync_ValidDto_UpdatesStaff()
        {

            var staffIdValue = "D20240004";
            var dto = new EditingStaffDto(
                staffId: staffIdValue,
                firstName: "Vasco",
                lastName: "Teixeira",
                fullName: "Vasco Teixeira",
                email: "vasco.teixeira@updated.com",
                phoneNumber: "912345678",
                specializationId: _specializations[1].Id.AsString(),
                availabilitySlots: "[{\"Start\":\"2024-12-31T22:00:00\",\"End\":\"2024-12-31T23:00:00\"}]"
            );

            var staffId = new StaffId(dto.StaffId);
            var existingStaff = _staffs[1];

            _staffRepositoryMock.Setup(repo => repo.GetByIdAsync(staffId)).ReturnsAsync(existingStaff);
            
            var result = await _staffService.UpdateAsync(dto);

            Assert.NotNull(result);
            Assert.Equal(dto.FirstName, result.StaffFirstName);
            Assert.Equal(dto.LastName, result.StaffLastName);
            Assert.Equal(dto.FullName, result.StaffFullName);
            Assert.Equal(dto.Email, result.StaffEmail);
            Assert.Equal(dto.PhoneNumber, result.StaffPhoneNumber);
            Assert.Equal(dto.SpecializationId, result.SpecializationId);
            Assert.Equal(dto.AvailabilitySlots, result.StaffAvailabilitySlots);
            
            _emailServiceMock.Verify(es => es.SendEmailAsync(It.IsAny<List<string>>(), It.IsAny<string>(), It.IsAny<string>()), Times.Once);
            
            _logRepositoryMock.Verify(logRepo => logRepo.AddAsync(It.IsAny<Log>()), Times.Once);

            _unitOfWorkMock.Verify(uow => uow.CommitAsync(), Times.Exactly(2));
        }

        [Fact]
        public async Task DeleteAsync_ValidId_DeletesStaff_ReturnsStaffDto()
        {
            var staffId = new StaffId("D20240002");
            _staffRepositoryMock.Setup(repo => repo.GetByIdAsync(staffId)).ReturnsAsync(_staffs[1]);
            
            var result = await _staffService.DeleteAsync(staffId);

            Assert.NotNull(result);
            Assert.Equal(staffId.AsString(), result.StaffId);
            Assert.Equal(_staffs[1].StaffFirstName.ToString(), result.StaffFirstName);
            Assert.Equal(_staffs[1].StaffLastName.ToString(), result.StaffLastName);
            Assert.Equal(_staffs[1].StaffFullName.ToString(), result.StaffFullName);
            Assert.Equal(_staffs[1].StaffLicenseNumber.ToString(), result.StaffLicenseNumber);
            Assert.Equal(_staffs[1].SpecializationId.AsString(), result.SpecializationId);
            Assert.Equal(_staffs[1].StaffEmail.ToString(), result.StaffEmail);
            Assert.Equal(_staffs[1].StaffPhoneNumber.ToString(), result.StaffPhoneNumber);
            Assert.Equal(_staffs[1].StaffAvailabilitySlots.Slots, result.StaffAvailabilitySlots);
            Assert.Equal(_staffs[1].UserId.ToString(), result.UserId);

            _staffRepositoryMock.Verify(repo => repo.Remove(_staffs[1]), Times.Once);
            _unitOfWorkMock.Verify(uow => uow.CommitAsync(), Times.Once);
        }

        [Fact]
        public async Task SearchStaffAsync_ValidSearchCriteria_ReturnsFilteredStaff()
        {
            var searchDto = new StaffSearchDto
            {
                FullName = "Bruno",
                SpecializationId = _specializations[1].Id.AsString(),
                PhoneNumber = "927654321"
            };

            var filteredStaffs = _staffs.Where(staff => 
                staff.StaffFullName.FullNameString.Contains(searchDto.FullName, StringComparison.OrdinalIgnoreCase) &&
                staff.StaffPhoneNumber.PhoneNumberString == searchDto.PhoneNumber &&
                staff.SpecializationId.Equals(searchDto.SpecializationId))
                .ToList();

            _staffRepositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(_staffs);

            var result = await _staffService.SearchStaffAsync(searchDto);

            Assert.Equal(filteredStaffs.Count, result.Count());
            Assert.All(result, r => Assert.Contains(searchDto.FullName, r.StaffFullName));
            Assert.All(result, r => Assert.Equal(searchDto.PhoneNumber, r.StaffPhoneNumber));
            Assert.All(result, r => Assert.Equal(searchDto.SpecializationId.ToString(), r.SpecializationId));
        }
    }
}
