using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Moq;
using Xunit;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Specializations;

namespace DDDSample1.Tests.Domain.Specializations
{
    public class SpecializationServiceTests
    {
        private readonly Mock<IUnitOfWork> _mockUnitOfWork;
        private readonly Mock<ISpecializationRepository> _mockRepo;
        private readonly SpecializationService _service;

        public SpecializationServiceTests()
        {
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            _mockRepo = new Mock<ISpecializationRepository>();
            _service = new SpecializationService(_mockUnitOfWork.Object, _mockRepo.Object);
        }

        [Fact]
        public async Task GetAllAsyncTest()
        {
            var specializations = new List<Specialization>
            {
                new Specialization(new SpecializationName("Cardiology")),
                new Specialization(new SpecializationName("Neurology"))
            };
            _mockRepo.Setup(repo => repo.GetAllAsync()).ReturnsAsync(specializations);

            var result = await _service.GetAllAsync();

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, dto => dto.SpecializationName == "Cardiology");
            Assert.Contains(result, dto => dto.SpecializationName == "Neurology");
        }

        [Fact]
        public async Task GetByIdAsyncTest()
        {
            var specializationId = new SpecializationId(Guid.NewGuid());
            var specialization = new Specialization(new SpecializationName("Cardiology"));
            _mockRepo.Setup(repo => repo.GetByIdAsync(specializationId)).ReturnsAsync(specialization);

            var result = await _service.GetByIdAsync(specializationId);

            Assert.NotNull(result);
            Assert.Equal(specialization.SpecializationName.ToString(), result.SpecializationName);
            Assert.Equal("Cardiology", result.SpecializationName);
        }

/**
        [Fact]
        public async Task AddAsyncTest()
        {
            var dto = new CreatingSpecializationDto("Cardiology");
            var expectedSpecialization = new Specialization(new SpecializationName(dto.SpecializationName));
    
            _mockRepo.Setup(repo => repo.AddAsync(It.IsAny<Specialization>()))
               .Returns((Task<Specialization>)Task.CompletedTask);

            _mockUnitOfWork.Setup(uow => uow.CommitAsync()).Returns((Task<int>)Task.CompletedTask);

            var result = await _service.AddAsync(dto);

            Assert.NotNull(result);
        Assert.Equal(expectedSpecialization.Id.AsGuid(), result.Id);
        Assert.Equal(dto.SpecializationName, result.SpecializationName);
}


        [Fact]
        public async Task UpdateAsyncTest()
        {
            var specializationId = new SpecializationId(Guid.NewGuid());
            var specialization = new Specialization(new SpecializationName("Cardiology"));
            var dto = new SpecializationDto { Id = specializationId.AsGuid(), SpecializationName = "Neurology" };
            _mockRepo.Setup(repo => repo.GetByIdAsync(specializationId)).ReturnsAsync(specialization);
            _mockUnitOfWork.Setup(uow => uow.CommitAsync()).Returns((Task<int>)Task.CompletedTask);

            var result = await _service.UpdateAsync(dto);

            Assert.NotNull(result);
            Assert.Equal(specializationId.AsGuid(), result.Id);
            Assert.Equal("Neurology", result.SpecializationName);
        }

        [Fact]
        public async Task InactiveAsyncTest()
        {
            var specializationId = new SpecializationId(Guid.NewGuid());
            var specialization = new Specialization(new SpecializationName("Cardiology"));
            _mockRepo.Setup(repo => repo.GetByIdAsync(specializationId)).ReturnsAsync(specialization);
            _mockUnitOfWork.Setup(uow => uow.CommitAsync()).Returns((Task<int>)Task.CompletedTask);

            var result = await _service.InactivateAsync(specializationId);

            Assert.NotNull(result);
            Assert.Equal(specializationId.AsGuid(), result.Id);
            Assert.Equal("Cardiology", result.SpecializationName);
        }

        [Fact]
        public async Task DeleteAsyncTest()
        {
            var specializationId = new SpecializationId(Guid.NewGuid());
            var specialization = new Specialization(new SpecializationName("Cardiology"));
            _mockRepo.Setup(repo => repo.GetByIdAsync(specializationId)).ReturnsAsync(specialization);
            _mockRepo.Setup(repo => repo.Remove(specialization));
            _mockUnitOfWork.Setup(uow => uow.CommitAsync()).Returns((Task<int>)Task.CompletedTask);

            var result = await _service.DeleteAsync(specializationId);

            Assert.NotNull(result);
            Assert.Equal(specializationId.AsGuid(), result.Id);
            Assert.Equal("Cardiology", result.SpecializationName);
        }

        */
        [Fact]
        public async Task GetByIdAsyncTestShouldReturnNull()
        {
            var specializationId = new SpecializationId(Guid.NewGuid());
            _mockRepo.Setup(repo => repo.GetByIdAsync(specializationId)).ReturnsAsync((Specialization)null);

            var result = await _service.GetByIdAsync(specializationId);

            Assert.Null(result);
        }

        [Fact]
        public async Task UpdateAsyncTestShouldReturnNull()
        {
            var specializationId = new SpecializationId(Guid.NewGuid());
            var dto = new SpecializationDto { Id = specializationId.AsGuid(), SpecializationName = "Neurology" };
            _mockRepo.Setup(repo => repo.GetByIdAsync(specializationId)).ReturnsAsync((Specialization)null);

            var result = await _service.UpdateAsync(dto);

            Assert.Null(result);
        }

        [Fact]
        public async Task DeleteAsyncTestShouldReturnNull()
        {
            var specializationId = new SpecializationId(Guid.NewGuid());
            _mockRepo.Setup(repo => repo.GetByIdAsync(specializationId)).ReturnsAsync((Specialization)null);

            var result = await _service.DeleteAsync(specializationId);

            Assert.Null(result);
        }
    }
}
