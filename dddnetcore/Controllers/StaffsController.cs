using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DDDSample1.Domain.Staffs;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
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

        // PUT: api/staff
        [HttpPut]
        public async Task<ActionResult<StaffDto>> Update(StaffDto dto)
        {
            var updatedStaff = await _staffService.UpdateAsync(dto);
            if (updatedStaff == null)
                return NotFound();

            return Ok(updatedStaff);
        }

        // DELETE: api/staff/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult<StaffDto>> Delete(string id)
        {
            var staffId = new StaffId(id);
            var deletedStaff = await _staffService.DeleteAsync(staffId);
            if (deletedStaff == null)
                return NotFound();

            return Ok(deletedStaff);
        }
    }
}
