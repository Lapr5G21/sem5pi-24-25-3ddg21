using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using DDDSample1.Controllers;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Specializations;

public class SpecializationsControllerTests
{
    private readonly Mock<SpecializationService> _mockService;
    private readonly SpecializationsController _controller;

    public SpecializationsControllerTests()
    {
        _mockService = new Mock<SpecializationService>();
        _controller = new SpecializationsController(_mockService.Object);
    }

    [Fact]
    public async Task GetAllSpecializationsTest()
    {
        var specializations = new List<SpecializationDto>
        {
            new SpecializationDto { Id = Guid.NewGuid(), SpecializationName = "Cardiology" },
            new SpecializationDto { Id = Guid.NewGuid(), SpecializationName = "Orthopedist" }
        };
        _mockService.Setup(s => s.GetAllAsync()).ReturnsAsync(specializations);

        var result = await _controller.GetAll();

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnedSpecializations = Assert.IsType<List<SpecializationDto>>(okResult.Value);
        Assert.Equal(2, returnedSpecializations.Count);
    }

    [Fact]
    public async Task GetByIdReturnsNotFoundWhenSpecializationDontExistTest()
    {
        var id = Guid.NewGuid().ToString();
        _mockService.Setup(s => s.GetByIdAsync(It.IsAny<SpecializationId>())).ReturnsAsync((SpecializationDto)null);

        var result = await _controller.GetById(id);

        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public async Task CreateSpecializationTest()
    {
        var newSpecializationDto = new CreatingSpecializationDto("Cardiology");
        var createdSpecialization = new SpecializationDto { Id = Guid.NewGuid(), SpecializationName = "Cardiology" };
        _mockService.Setup(s => s.AddAsync(newSpecializationDto)).ReturnsAsync(createdSpecialization);

        var result = await _controller.Create(newSpecializationDto);

        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        Assert.Equal(createdSpecialization.Id, ((SpecializationDto)createdAtActionResult.Value).Id);
    }

    [Fact]
    public async Task UpdateIdTest()
    {
        var id = Guid.NewGuid().ToString();
        var specializationDto = new SpecializationDto { Id = Guid.NewGuid() };

        var result = await _controller.Update(id, specializationDto);

        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public async Task SoftDeleteSpecializationExists()
    {
        var id = Guid.NewGuid().ToString();
        var specialization = new SpecializationDto { Id = Guid.NewGuid(), SpecializationName = "Cardiology" };
        _mockService.Setup(s => s.InactivateAsync(It.IsAny<SpecializationId>())).ReturnsAsync(specialization);

        var result = await _controller.SoftDelete(id);

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        Assert.IsType<SpecializationDto>(okResult.Value);
    }

    [Fact]
    public async Task HardDeleteReturnsNotFoundWhenDontExist()
    {
        var id = Guid.NewGuid().ToString();
        _mockService.Setup(s => s.DeleteAsync(It.IsAny<SpecializationId>())).ReturnsAsync((SpecializationDto)null);

        var result = await _controller.HardDelete(id);

        Assert.IsType<NotFoundResult>(result.Result);
    }
}
