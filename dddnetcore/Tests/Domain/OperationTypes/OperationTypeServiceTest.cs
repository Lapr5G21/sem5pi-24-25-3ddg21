using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Moq;
using Xunit;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.OperationTypesSpecializations;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Specializations;

namespace DDDSample1.Tests.Domain.OperationTypes
{
    public class OperationTypeServiceTests
    {
        private readonly Mock<IUnitOfWork> _mockUnitOfWork;
        private readonly Mock<IOperationTypeRepository> _mockOperationTypeRepo;
        private readonly Mock<ISpecializationRepository> _mockSpecializationRepo;
        private readonly Mock<IOperationTypeSpecializationRepository> _mockOperationTypeSpecializationRepo;
        private readonly OperationTypeService _service;

        public OperationTypeServiceTests()
        {
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            _mockOperationTypeRepo = new Mock<IOperationTypeRepository>();
            _mockSpecializationRepo = new Mock<ISpecializationRepository>();
            _mockOperationTypeSpecializationRepo = new Mock<IOperationTypeSpecializationRepository>();

            _service = new OperationTypeService(
                _mockUnitOfWork.Object,
                _mockOperationTypeRepo.Object,
                _mockSpecializationRepo.Object,
                _mockOperationTypeSpecializationRepo.Object);
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

            _mockOperationTypeRepo.Setup(repo => repo.GetAllAsync()).ReturnsAsync(operationTypes);

            var result = await _service.GetAllAsync();

            Assert.Single(result);
            Assert.Equal("Cardiology", result[0].Name);
            Assert.Equal(120, result[0].EstimatedTimeDuration);
        }

        [Fact]
        public async Task GetByIdAsync()
        {
            var operationTypeId = new OperationTypeId(Guid.NewGuid());
            var operationType = new OperationType(
                new OperationTypeName("Cardiology"),
                new EstimatedTimeDuration(120),
                new AnesthesiaTime(30),
                new CleaningTime(15),
                new SurgeryTime(90));

            _mockOperationTypeRepo.Setup(repo => repo.GetByIdAsync(operationTypeId)).ReturnsAsync(operationType);

            var result = await _service.GetByIdAsync(operationTypeId);

            Assert.NotNull(result);
            Assert.Equal("Cardiology", result.Name);
        }

 //       [Fact]
//        public async Task AddAsyncTest()
//        {
//
//            var mockUnitOfWork = new Mock<IUnitOfWork>();
//            var mockRepo = new Mock<IOperationTypeRepository>();
//            var mockSpecializationRepo = new Mock<ISpecializationRepository>();
 //           var mockOpTypeSpecRepo = new Mock<IOperationTypeSpecializationRepository>();

 //           var creatingDto = new CreatingOperationTypeDto
 //           {
//                Name = "Neurology",
//                EstimatedTimeDuration = 150,
//                AnesthesiaTime = 40,
//                CleaningTime = 20,
//                SurgeryTime = 110,
 //               Specializations = new List<CreatingOperationTypeSpecializationDto>
 //               {
 //                   new CreatingOperationTypeSpecializationDto(Guid.NewGuid().ToString(), 3)
  //              }
 //           };

 //           var service = new OperationTypeService(
 //               mockUnitOfWork.Object,
 //               mockRepo.Object,
 //               mockSpecializationRepo.Object,
  //              mockOpTypeSpecRepo.Object);

 //           var result = await service.AddAsync(creatingDto);

 //           Assert.NotNull(result);
//            Assert.Equal("Neurology", result.Name);
//            Assert.Equal(150, result.EstimatedTimeDuration);
 //           Assert.Equal(40, result.AnesthesiaTime);
 //           Assert.Equal(20, result.CleaningTime);
 //           Assert.Equal(110, result.SurgeryTime);

 //           mockUnitOfWork.Verify(uow => uow.CommitAsync(), Times.Exactly(2));
 //       }

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

            var updateDto = new OperationTypeDto
            {
                Id = operationTypeId.AsGuid(),
                Name = "Neurology",
                EstimatedTimeDuration = 150,
                AnesthesiaTime = 40,
                CleaningTime = 20,
                SurgeryTime = 110
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
