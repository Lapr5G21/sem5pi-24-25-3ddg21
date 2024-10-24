using Moq;
using Xunit;
using System.Threading.Tasks;
using DDDSample1.Controllers;
using Microsoft.AspNetCore.Mvc;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.OperationTypesSpecializations;
using System.Collections.Generic;
using System;

namespace DDDSample1.Tests.Controllers
{
    public class OperationTypesControllerTests
    {
        private readonly Mock<OperationTypeService> _serviceMock;
        private readonly OperationTypesController _controller;

        public OperationTypesControllerTests()
        {
            _serviceMock = new Mock<OperationTypeService>();
            _controller = new OperationTypesController(_serviceMock.Object);
        }

        [Fact]
        public async Task GetAllOperationTypesTest()
        {
            var operationTypes = new List<OperationTypeDto>
            {
                new OperationTypeDto
                {
                    Id = Guid.NewGuid(),
                    Name = "ACL Surgery",
                    EstimatedTimeDuration = 100,
                    AnesthesiaTime = 10,
                    SurgeryTime = 90,
                    CleaningTime = 20,
                    IsActive = true,
                    Specializations = new List<OperationTypeSpecializationDto> { new OperationTypeSpecializationDto() }
                }
            };
            _serviceMock.Setup(s => s.GetAllAsync()).ReturnsAsync(operationTypes);

            var result = await _controller.GetAll();

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<List<OperationTypeDto>>(okResult.Value);
            Assert.Single(returnValue);
        }

        [Fact]
        public async Task GetByIdWithExistingIdTest()
        {
            var operationTypeDto = new OperationTypeDto
            {
                Id = Guid.NewGuid(),
                Name = "ACL Surgery",
                EstimatedTimeDuration = 100,
                AnesthesiaTime = 30,
                SurgeryTime = 90,
                CleaningTime = 20,
                IsActive = true,
                Specializations = new List<OperationTypeSpecializationDto> { new OperationTypeSpecializationDto{} }
            };
            _serviceMock.Setup(s => s.GetByIdAsync(It.IsAny<OperationTypeId>())).ReturnsAsync(operationTypeDto);

            var result = await _controller.GetById(operationTypeDto.Id.ToString());

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<OperationTypeDto>(okResult.Value);
            Assert.Equal(operationTypeDto.Id, returnValue.Id);
            Assert.Equal("Operation 1", returnValue.Name);
            Assert.Equal(120, returnValue.EstimatedTimeDuration);
            Assert.Equal(30, returnValue.AnesthesiaTime);
            Assert.Equal(90, returnValue.SurgeryTime);
            Assert.Equal(20, returnValue.CleaningTime);
            Assert.True(returnValue.IsActive);
        }

        [Fact]
        public async Task GetByIdWithNonExistingIdTest()
        {
            _serviceMock.Setup(s => s.GetByIdAsync(It.IsAny<OperationTypeId>())).ReturnsAsync((OperationTypeDto)null);

            var result = await _controller.GetById("1");

            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task CreateWithValidDataTest()
        {
            var creatingDto = new CreatingOperationTypeDto
            {
                Name = "ACL Surgery",
                EstimatedTimeDuration = 100,
                AnesthesiaTime = 20,
                SurgeryTime = 70,
                CleaningTime = 10
            };
            var createdOperationType = new OperationTypeDto
            {
                Id = Guid.NewGuid(),
                Name = creatingDto.Name,
                EstimatedTimeDuration = creatingDto.EstimatedTimeDuration,
                AnesthesiaTime = creatingDto.AnesthesiaTime,
                SurgeryTime = creatingDto.SurgeryTime,
                CleaningTime = creatingDto.CleaningTime,
                IsActive = true,
                Specializations = new List<OperationTypeSpecializationDto>()
            };
            _serviceMock.Setup(s => s.AddAsync(It.IsAny<CreatingOperationTypeDto>())).ReturnsAsync(createdOperationType);

            // Act
            var result = await _controller.Create(creatingDto);

            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnValue = Assert.IsType<OperationTypeDto>(createdAtActionResult.Value);
            Assert.Equal(createdOperationType.Id, returnValue.Id);
            Assert.Equal("ACL Surgery", returnValue.Name);
        }

        [Fact]
        public async Task CrateWithDtoInvalidTest()
        {
            var result = await _controller.Create(null);

            Assert.IsType<BadRequestObjectResult>(result.Result);
        }

/*
       
        public async Task UpdateExistingOperationTypeTest()
        {
            var dto = new EditOperationTypeDto
            {
                
                Name = "OperationUpdated",
                EstimatedTimeDuration = 150,
                Specializations = new List<OperationTypeSpecialization> { new OperationTypeSpecializationDto() }
            };
            _serviceMock.Setup(s => s.UpdateAsync(It.IsAny<EditOperationTypeDto>())).ReturnsAsync(dto);

           
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<OperationTypeDto>(okResult.Value);
            Assert.Equal(dto.OperationTypeId, returnValue);
            Assert.Equal("OperationUpdated", returnValue.Name);
            Assert.Equal(150, returnValue.EstimatedTimeDuration);
        }
        


        public async Task UpdateNonExistingOperationTypeTest()
        {
            var dto = new EditOperationTypeDto { Id = Guid.NewGuid() };

            var result = await _controller.Update("different-id", dto);

            Assert.IsType<BadRequestObjectResult>(result.Result);
        }

  */      

        [Fact]
        public async Task SoftDeleteOperationTypeThatExistsTest()
        {
            var operationTypeDto = new OperationTypeDto { Id = Guid.NewGuid() };
            _serviceMock.Setup(s => s.InactivateAsync(It.IsAny<OperationTypeId>())).ReturnsAsync(operationTypeDto);

            var result = await _controller.SoftDelete(operationTypeDto.Id.ToString());

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<OperationTypeDto>(okResult.Value);
            Assert.Equal(operationTypeDto.Id, returnValue.Id);
        }

        [Fact]
        public async Task SoftDeleteOperationTypeNonExistingTest()
        {
            _serviceMock.Setup(s => s.InactivateAsync(It.IsAny<OperationTypeId>())).ReturnsAsync((OperationTypeDto)null);

            var result = await _controller.SoftDelete("1");

            Assert.IsType<NotFoundResult>(result.Result);
        }
    }
}
