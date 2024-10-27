using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Moq;
using Xunit;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.OperationTypesSpecializations;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Specializations;
using DDDSample1.Domain.AuditLogs;
using Microsoft.AspNetCore.Http.HttpResults;

namespace DDDSample1.Tests.Domain.OperationTypes
{
    public class OperationTypeServiceTests
    {
        private readonly Mock<IUnitOfWork> _mockUnitOfWork;
        private readonly Mock<IOperationTypeRepository> _mockOperationTypeRepo;
        private readonly Mock<ISpecializationRepository> _mockSpecializationRepo;
        private readonly Mock<IOperationTypeSpecializationRepository> _mockOperationTypeSpecializationRepo;
        private readonly Mock<ILogRepository> _mockLogRepository;
        private readonly OperationTypeService _service;

        public OperationTypeServiceTests()
        {
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            _mockOperationTypeRepo = new Mock<IOperationTypeRepository>();
            _mockSpecializationRepo = new Mock<ISpecializationRepository>();
            _mockOperationTypeSpecializationRepo = new Mock<IOperationTypeSpecializationRepository>();
            _mockLogRepository= new Mock<ILogRepository>();

            _service = new OperationTypeService(
                _mockUnitOfWork.Object,
                _mockOperationTypeRepo.Object,
                _mockSpecializationRepo.Object,
                _mockOperationTypeSpecializationRepo.Object,
                _mockLogRepository.Object);
        }

        [Fact]
        public async Task GetAllAsyncTest()
        {
            var operationTypes = new List<OperationType>
            {
                new OperationType(
                    new OperationTypeName("Cardiology"),
                    new EstimatedTimeDuration(120),
                    new AnesthesiaTime(30),
                    new CleaningTime(15),
                    new SurgeryTime(90))
            };

            var operationTypeSpecializations = new List<OperationTypeSpecialization>
            {
                new OperationTypeSpecialization
                (
                    operationTypes[0],
                    new Specialization(new SpecializationName("Surgery")),
                    new NumberOfStaff(5)
                )
            };

            var specializations = new List<Specialization>
            {
                new Specialization(new SpecializationName("Surgery"))
            };

            _mockOperationTypeRepo.Setup(repo => repo.GetAllAsync()).ReturnsAsync(operationTypes);
            _mockOperationTypeSpecializationRepo.Setup(repo => repo.GetAllAsync()).ReturnsAsync(operationTypeSpecializations);
            _mockSpecializationRepo.Setup(repo => repo.GetAllAsync()).ReturnsAsync(specializations);

            var result = await _service.GetAllAsync();

            Assert.NotNull(result);

            Assert.Single(result);
            var operationTypeDto = result[0];
            Assert.Equal("Cardiology", operationTypeDto.Name);
            Assert.Equal(120, operationTypeDto.EstimatedTimeDuration);
            Assert.Equal(30, operationTypeDto.AnesthesiaTime);
            Assert.Equal(15, operationTypeDto.CleaningTime);
            Assert.Equal(90, operationTypeDto.SurgeryTime);

            Assert.Single(operationTypeDto.Specializations);
            var specializationDto = operationTypeDto.Specializations[0];
            Assert.Equal(5, specializationDto.NumberOfStaff);
        }



        [Fact]
        public async Task GetByIdAsync()
        {

            var operationType = new OperationType(
            new OperationTypeName("Cardiology"),
            new EstimatedTimeDuration(120),
            new AnesthesiaTime(30),
            new CleaningTime(15),
            new SurgeryTime(90));

            var operationTypeSpecializations = new List<OperationTypeSpecialization>
            {
                new OperationTypeSpecialization(
             operationType,
            new Specialization(new SpecializationName("Surgery")),
            new NumberOfStaff(5))
            };

            var specializations = new List<Specialization>
            {
                new Specialization(new SpecializationName("Surgery"))
            };

            _mockOperationTypeRepo.Setup(repo => repo.GetByIdAsync(operationType.Id)).ReturnsAsync(operationType);
            _mockOperationTypeSpecializationRepo.Setup(repo => repo.GetAllAsync()).ReturnsAsync(operationTypeSpecializations);
            _mockSpecializationRepo.Setup(repo => repo.GetAllAsync()).ReturnsAsync(specializations);

            var result = await _service.GetByIdAsync(operationType.Id);

            Assert.NotNull(result);
            Assert.Equal("Cardiology", result.Name);
    
            Assert.Single(result.Specializations);
            var specializationDto = result.Specializations[0];
            Assert.Equal(5, specializationDto.NumberOfStaff);
        } 

        [Fact]
        public async Task GetByIdAsync_NotFound()
        {
            var operationTypeId = new OperationTypeId(Guid.NewGuid());

            _mockOperationTypeRepo.Setup(repo => repo.GetByIdAsync(operationTypeId)).ReturnsAsync((OperationType)null);

            var result = await _service.GetByIdAsync(operationTypeId);

            Assert.Null(result);
        }

        [Fact]
public async Task AddAsyncValidDto()
{
    var dto = new CreatingOperationTypeDto
    {
        Name = "Cardiology",
        EstimatedTimeDuration = 120,
        AnesthesiaTime = 30,
        CleaningTime = 15,
        SurgeryTime = 90,
        Specializations = new List<CreatingOperationTypeSpecializationDto>
        {
            new CreatingOperationTypeSpecializationDto(Guid.NewGuid().ToString(), 2)
        }
    };

    var specialization = new Specialization(new SpecializationName("Cardiology Specialization"));

    _mockSpecializationRepo.Setup(repo => repo.GetByIdAsync(It.IsAny<SpecializationId>()))
        .ReturnsAsync(specialization); 

    _mockOperationTypeRepo.Setup(repo => repo.AddAsync(It.IsAny<OperationType>()))
        .ReturnsAsync((OperationType)null); 


    _mockOperationTypeSpecializationRepo.Setup(repo => repo.AddAsync(It.IsAny<OperationTypeSpecialization>()))
        .ReturnsAsync((OperationTypeSpecialization)null);

    _mockUnitOfWork.Setup(uow => uow.CommitAsync())
        .Returns(Task.FromResult(0));

    var result = await _service.AddAsync(dto);

    Assert.NotNull(result);
    Assert.Equal("Cardiology", result.Name);
    Assert.Single(result.Specializations);
    Assert.Equal(2, result.Specializations[0].NumberOfStaff);
}

        [Fact]
        public async Task AddAsyncInvalidSpecialization()
        {
    var dto = new CreatingOperationTypeDto
    {
        Name = "Cardiology",
        EstimatedTimeDuration = 120,
        AnesthesiaTime = 30,
        CleaningTime = 15,
        SurgeryTime = 90,
        Specializations = new List<CreatingOperationTypeSpecializationDto>
        {
            new CreatingOperationTypeSpecializationDto (Guid.NewGuid().ToString(), 2)
        }
        };

        var specializationId = new SpecializationId(dto.Specializations[0].SpecializationId);

        _mockSpecializationRepo.Setup(repo => repo.GetByIdAsync(specializationId))
            .ReturnsAsync((Specialization)null);

        var exception = await Assert.ThrowsAsync<BusinessRuleValidationException>(async () =>
        await _service.AddAsync(dto));

        Assert.Equal($"Specialization with ID {specializationId.AsGuid()} not found", exception.Message);
        }

        [Fact]
        public async Task UpdateAsyncTest()
        {
            var operationTypeId = new OperationTypeId(Guid.NewGuid());
            var operationType = new OperationType(
                new OperationTypeName("Cardiology"),
                new EstimatedTimeDuration(120),
                new AnesthesiaTime(30),
                new CleaningTime(15),
                new SurgeryTime(90));

            _mockOperationTypeRepo.Setup(repo => repo.GetByIdAsync(operationTypeId)).ReturnsAsync(operationType);

            var updateDto = new EditOperationTypeDto
            {
            };

            var result = await _service.UpdateAsync(updateDto);

            _mockUnitOfWork.Verify(uow => uow.CommitAsync(), Times.Once);
            Assert.Equal("Neurology", result.Name);
            Assert.Equal(150, result.EstimatedTimeDuration);
        }

        [Fact]
        public async Task InactiveAsyncTest()
        {
            var operationTypeId = new OperationTypeId(Guid.NewGuid());
            var operationType = new OperationType(
                new OperationTypeName("Cardiology"),
                new EstimatedTimeDuration(120),
                new AnesthesiaTime(30),
                new CleaningTime(15),
                new SurgeryTime(90));

            _mockOperationTypeRepo.Setup(repo => repo.GetByIdAsync(operationTypeId)).ReturnsAsync(operationType);

            var result = await _service.InactivateAsync(operationTypeId);

            
            Assert.False(operationType.IsActive);
            _mockUnitOfWork.Verify(uow => uow.CommitAsync(), Times.Once);
        }

        [Fact]
        public async Task DeleteAsyncWhenIsInactiveTest()
        {
            var operationTypeId = new OperationTypeId(Guid.NewGuid());
            var operationType = new OperationType(
                new OperationTypeName("Cardiology"),
                new EstimatedTimeDuration(120),
                new AnesthesiaTime(30),
                new CleaningTime(15),
                new SurgeryTime(90));

            operationType.MarkAsInative();

            _mockOperationTypeRepo.Setup(repo => repo.GetByIdAsync(operationTypeId)).ReturnsAsync(operationType);

            var result = await _service.DeleteAsync(operationTypeId);

            _mockOperationTypeRepo.Verify(repo => repo.Remove(It.IsAny<OperationType>()), Times.Once);
            _mockUnitOfWork.Verify(uow => uow.CommitAsync(), Times.Once);
        }

        [Fact]
        public async Task DeleteAsyncWhenIsActiveTest()
        {
            var operationTypeId = new OperationTypeId(Guid.NewGuid());
            var operationType = new OperationType(
                new OperationTypeName("Cardiology"),
                new EstimatedTimeDuration(120),
                new AnesthesiaTime(30),
                new CleaningTime(15),
                new SurgeryTime(90));

            _mockOperationTypeRepo.Setup(repo => repo.GetByIdAsync(operationTypeId)).ReturnsAsync(operationType);

            await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _service.DeleteAsync(operationTypeId));
        }
    }
}
