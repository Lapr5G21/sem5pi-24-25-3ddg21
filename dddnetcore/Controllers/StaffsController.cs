using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DDDSample1.Domain.Staffs;
using DDDSample1.Domain.Shared;
using System;

namespace DDDSample1.Controllers
{
    [Route("api/staffs")]
    [ApiController]
    public class StaffsController : ControllerBase
    {
        private readonly StaffService _staffService;

        public StaffsController(StaffService staffService)
        {
            _staffService = staffService;
        }

        // GET: api/staff
        [HttpGet]
        public async Task<ActionResult<List<StaffDto>>> GetAll()
        {
            var staffList = await _staffService.GetAllAsync();
            return Ok(staffList);
        }

        // GET: api/staff/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<StaffDto>> GetById(string id)
        {
            var staffId = new StaffId(id);
            var staff = await _staffService.GetByIdAsync(staffId);
            if (staff == null)
                return NotFound();

            return Ok(staff);
        }

        // POST: api/staff
        [HttpPost]
        public async Task<ActionResult<StaffDto>> Create(CreatingStaffDto dto)
        {
            var staff = await _staffService.AddAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = staff.StaffId }, staff);
        }

        // PUT: api/staffs/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<StaffDto>> Update(string id, [FromBody] EditingStaffDto dto)
        {
            if (id != dto.StaffId)
            {
                return BadRequest("ID mismatch.");
            }

            try
            {
                var updatedStaff = await _staffService.UpdateAsync(dto);

                if (updatedStaff == null)
                {
                    return NotFound();
                }

                return Ok(updatedStaff);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        // DELETE: api/staffs/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult<StaffDto>> SoftDelete(string id)
        {
            var staff = await _staffService.InactivateAsync(new StaffId(id));

            if (staff == null)
            {
                return NotFound();
            }

            return Ok(staff);
        }

        // DELETE: api/staff/{id}/hard
        [HttpDelete("{id}/hard")]
        public async Task<ActionResult<StaffDto>> Delete(string id)
        {
            var staffId = new StaffId(id);
            var deletedStaff = await _staffService.DeleteAsync(staffId);
            if (deletedStaff == null)
                return NotFound();

            return Ok(deletedStaff);
        }

            [HttpGet("search")]
            public async Task<IActionResult> SearchStaffs([FromQuery] string fullName, [FromQuery] string phoneNumber, string email, [FromQuery] string specializationId, [FromQuery] bool? isActive)
            {      
                try
                {
                    var searchDto = new StaffSearchDto
                {
                    FullName = fullName,
                    PhoneNumber = phoneNumber,
                    Email = email,
                    SpecializationId = specializationId,
                    Active = isActive
                };

                var staffs = await _staffService.SearchStaffAsync(searchDto);
                return Ok(staffs);
                }
                catch (Exception ex)
                {
                    return BadRequest($"An error occurred while searching: {ex.Message}");
                }
            }

    }
}
