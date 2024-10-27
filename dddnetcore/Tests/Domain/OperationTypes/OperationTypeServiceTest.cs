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
using System.Linq;
using FluentAssertions;

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
    var existingOperationType = new OperationType(
        new OperationTypeName("Cardiology"),
        new EstimatedTimeDuration(120),
        new AnesthesiaTime(30),
        new CleaningTime(15),
        new SurgeryTime(90));

    _mockOperationTypeRepo.Setup(repo => repo.GetByIdAsync(existingOperationType.Id))
        .ReturnsAsync(existingOperationType);

    var specialization = new Specialization( new SpecializationName("Cardiology Specialization"));

    _mockSpecializationRepo.Setup(repo => repo.GetByIdAsync(specialization.Id))
        .ReturnsAsync(specialization);

    var allSpecializations = new List<Specialization> { specialization };
    _mockSpecializationRepo.Setup(repo => repo.GetAllAsync()).ReturnsAsync(allSpecializations);

    var operationTypeSpecialization = new OperationTypeSpecialization(existingOperationType, specialization, new NumberOfStaff(2));
    _mockOperationTypeSpecializationRepo.Setup(repo => repo.GetAllAsync())
        .ReturnsAsync(new List<OperationTypeSpecialization> { operationTypeSpecialization });

    var updateDto = new EditOperationTypeDto
    {
        OperationTypeId = existingOperationType.Id.AsString(),
        Name = "Neurology",
        EstimatedTimeDuration = 150,
        Specializations = new List<CreatingOperationTypeSpecializationDto>
        {
            new CreatingOperationTypeSpecializationDto(specialization.Id.AsString(), 2) 
        }
        };

        _mockLogRepository.Setup(logRepo => logRepo.LogUpdateOperation(It.IsAny<LogCategoryType>(), It.IsAny<string>()))
            .Returns(new Log(new LogId(Guid.NewGuid().ToString()), LogActionType.UPDATE, new LogContent("DETAILS"), LogCategoryType.OPERATIONTYPE));

        var result = await _service.UpdateAsync(updateDto);

        Assert.NotNull(result);
        Assert.Equal("Neurology", result.Name);
        Assert.Equal(150, result.EstimatedTimeDuration);

        _mockUnitOfWork.Verify(uow => uow.CommitAsync(), Times.Once);
        _mockLogRepository.Verify(logRepo => logRepo.LogUpdateOperation(LogCategoryType.OPERATIONTYPE, It.IsAny<string>()), Times.Once);

        Assert.Equal("Neurology", existingOperationType.Name.ToString());
        Assert.Equal(150, existingOperationType.EstimatedTimeDuration.Minutes);
        Assert.Single(existingOperationType.Specializations);
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

        [Fact]
        public async Task SearchOperationTypeAsyncValidName()
        {
            var searchDto = new SearchOperationTypeDto { Name = "Cardiology" };
            var operationType = new OperationType(new OperationTypeName("Cardiology"), 
                                              new EstimatedTimeDuration(120), 
                                              new AnesthesiaTime(30), 
                                              new CleaningTime(15), 
                                              new SurgeryTime(90));

            var operationTypes = new List<OperationType> { operationType };
            var specializations = new List<Specialization>();
            var operationTypeSpecializations = new List<OperationTypeSpecialization>();

            _mockOperationTypeRepo.Setup(repo => repo.GetAllAsync()).ReturnsAsync(operationTypes);
            _mockSpecializationRepo.Setup(repo => repo.GetAllAsync()).ReturnsAsync(specializations);
            _mockOperationTypeSpecializationRepo.Setup(repo => repo.GetAllAsync()).ReturnsAsync(operationTypeSpecializations);

            var result = await _service.SearchOperationTypesAsync(searchDto);

            Assert.Single(result);
            Assert.Equal("Cardiology", result.First().Name);
        }

    [Fact]
    public async Task SearchOperationTypesAsyncValidSpecialization()
    {    
    var operationType = new OperationType(new OperationTypeName("Cardiology"),
                                          new EstimatedTimeDuration(120),
                                          new AnesthesiaTime(30),
                                          new CleaningTime(15),
                                          new SurgeryTime(90));

    var specialization = new Specialization(new SpecializationName("Cardiology Specialization"));
    var searchDto = new SearchOperationTypeDto { SpecializationId = specialization.Id.AsGuid() };
    var operationTypeSpecialization = new OperationTypeSpecialization(operationType, specialization, new NumberOfStaff(2));

    var operationTypes = new List<OperationType> { operationType };
    var specializations = new List<Specialization> { specialization };
    var operationTypeSpecializations = new List<OperationTypeSpecialization> { operationTypeSpecialization };

    _mockOperationTypeRepo.Setup(repo => repo.GetAllAsync()).ReturnsAsync(operationTypes);
    _mockSpecializationRepo.Setup(repo => repo.GetAllAsync()).ReturnsAsync(specializations);
    _mockOperationTypeSpecializationRepo.Setup(repo => repo.GetAllAsync()).ReturnsAsync(operationTypeSpecializations);

    var result = await _service.SearchOperationTypesAsync(searchDto);

    Assert.Single(result); 
    Assert.Equal("Cardiology", result.First().Name); 
    }

    [Fact]
    public async Task SearchOperationTypesAsyncNoMatchingNameReturnsEmptyList()
    {
    var searchDto = new SearchOperationTypeDto { Name = "NonExistentName" };
    var operationType = new OperationType(new OperationTypeName("Cardiology"),
                                          new EstimatedTimeDuration(120),
                                          new AnesthesiaTime(30),
                                          new CleaningTime(15),
                                          new SurgeryTime(90));

    var operationTypes = new List<OperationType> { operationType };

    _mockOperationTypeRepo.Setup(repo => repo.GetAllAsync()).ReturnsAsync(operationTypes);
    _mockSpecializationRepo.Setup(repo => repo.GetAllAsync()).ReturnsAsync(new List<Specialization>());
    _mockOperationTypeSpecializationRepo.Setup(repo => repo.GetAllAsync()).ReturnsAsync(new List<OperationTypeSpecialization>());

    var result = await _service.SearchOperationTypesAsync(searchDto);

    Assert.Empty(result);
    }

    }
}
