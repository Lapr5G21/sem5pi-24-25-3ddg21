using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Controllers;
using DDDSample1.Domain.OperationRequest;
using DDDSample1.Domain.OperationRequestsx;
using DDDSample1.Domain.Staffs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace DDDSample1.Tests.Controllers
{
    public class OperationRequestControllerTests
    {

        /*
        private readonly Mock<OperationRequestService> _mockService;
        private readonly OperationRequestController _controller;

        public OperationRequestControllerTests()
        {
            _mockService = new Mock<OperationRequestService>();
            _controller = new OperationRequestController(_mockService.Object);
        }

        [Fact]
        public async Task GetAll_ShouldReturnOk_WithListOfOperationRequests()
        {
            // Arrange
            var mockOperationRequests = new List<OperationRequestDto>
            {
                new OperationRequestDto { Id = Guid.NewGuid(), PriorityLevel = "High", Status = "Scheduled" },
                new OperationRequestDto { Id = Guid.NewGuid(), PriorityLevel = "Low", Status = "Pending" }
            };
            _mockService.Setup(service => service.GetAllAsync()).ReturnsAsync(mockOperationRequests);

            // Act
            var result = await _controller.GetAll();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<List<OperationRequestDto>>(okResult.Value);
            Assert.Equal(2, returnValue.Count);
        }

        [Fact]
        public async Task GetById_ShouldReturnNotFound_WhenOperationRequestDoesNotExist()
        {
            // Arrange
            _mockService.Setup(service => service.GetByIdAsync(It.IsAny<OperationRequestId>())).ReturnsAsync((OperationRequestDto)null);

            // Act
            var result = await _controller.GetById("nonexistent-id");

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task Create_ShouldReturnCreatedAtAction_WhenOperationRequestIsCreated()
        {
            // Arrange
            var creatingDto = new CreatingOperationRequestDto
            {
                Priority = "High",
                OperationTypeId = Guid.NewGuid().ToString(),
                DoctorId = Guid.NewGuid().ToString(),
                PatientId = "MRN001",
                DeadlineDate = DateTime.UtcNow.AddDays(7),
                Status = "Scheduled"
            };
            var createdDto = new OperationRequestDto
            {
                Id = Guid.NewGuid(),
                PriorityLevel = "High",
                Status = "Scheduled"
            };
            _mockService.Setup(service => service.AddAsync(creatingDto)).ReturnsAsync(createdDto);

            // Act
            var result = await _controller.Create(creatingDto);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnValue = Assert.IsType<OperationRequestDto>(createdResult.Value);
            Assert.Equal(createdDto.Id, returnValue.Id);
        }

        [Fact]
        public async Task Update_ShouldReturnOk_WhenOperationRequestIsUpdated()
        {
            // Arrange
            var dto = new OperationRequestDto
            {
                Id = Guid.NewGuid(),
                PriorityLevel = "High",
                Status = "Scheduled"
            };
            var userId = dto.Id.ToString();

            _mockService.Setup(service => service.UpdateAsync(dto, It.IsAny<StaffId>())).ReturnsAsync(dto);

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };
            _controller.HttpContext.User = new System.Security.Claims.ClaimsPrincipal(new System.Security.Claims.ClaimsIdentity(new[] {
                new System.Security.Claims.Claim("sub", userId)
            }));

            // Act
            var result = await _controller.Update(dto.Id.ToString(), dto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<OperationRequestDto>(okResult.Value);
            Assert.Equal(dto.Id, returnValue.Id);
        }

        [Fact]
        public async Task Update_ShouldReturnBadRequest_WhenIdMismatch()
        {
            // Arrange
            var dto = new OperationRequestDto
            {
                Id = Guid.NewGuid(),
                PriorityLevel = "High",
                Status = "Scheduled"
            };

            // Act
            var result = await _controller.Update("different-id", dto);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal("ID mismatch.", badRequestResult.Value);
        }

        [Fact]
        public async Task Delete_ShouldReturnOk_WhenOperationRequestIsDeleted()
        {
            // Arrange
            var id = Guid.NewGuid().ToString();
            _mockService.Setup(service => service.DeleteAsync(It.IsAny<OperationRequestId>(), It.IsAny<StaffId>())).ReturnsAsync(true);

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };
            _controller.HttpContext.User = new System.Security.Claims.ClaimsPrincipal(new System.Security.Claims.ClaimsIdentity(new[] {
                new System.Security.Claims.Claim("sub", id)
            }));

            // Act
            var result = await _controller.Delete(id);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.True((bool)okResult.Value);
        }

        [Fact]
        public async Task Delete_ShouldReturnUnauthorized_WhenUserIsNotAuthenticated()
        {
            // Arrange
            var id = Guid.NewGuid().ToString();

            // Act
            var result = await _controller.Delete(id);

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result.Result);
            Assert.Equal("User is not authenticated", ((dynamic)unauthorizedResult.Value).Message);
        }
        */
    }
    
}
