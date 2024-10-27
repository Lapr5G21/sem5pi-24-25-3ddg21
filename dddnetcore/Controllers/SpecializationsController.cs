using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Specializations;
using Microsoft.AspNetCore.Authorization;

namespace DDDSample1.Controllers
{
    [Route("api/specializations")]
    [ApiController]
    public class SpecializationsController : ControllerBase
    {
        private readonly SpecializationService _service;

        public SpecializationsController(SpecializationService service)
        {
            _service = service;
        }

        // GET: api/specializations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SpecializationDto>>> GetAll()
        {
            var specializations = await _service.GetAllAsync();
            return Ok(specializations);
        }

        // GET: api/specializations/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<SpecializationDto>> GetById(string id)
        {
            var specialization = await _service.GetByIdAsync(new SpecializationId(id));

            if (specialization == null)
            {
                return NotFound();
            }

            return Ok(specialization);
        }

        // POST: api/specializations
        [Authorize(Policy="AdminRole")]
        [HttpPost]
        public async Task<ActionResult<SpecializationDto>> Create([FromBody] CreatingSpecializationDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Invalid data.");
            }

            var specialization = await _service.AddAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = specialization.Id }, specialization);
        }

        // PUT: api/specializations/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<SpecializationDto>> Update(string id, [FromBody] SpecializationDto dto)
        {
            if (id != dto.Id.ToString())
            {
                return BadRequest("ID mismatch.");
            }

            try
            {
                var updatedSpecialization = await _service.UpdateAsync(dto);

                if (updatedSpecialization == null)
                {
                    return NotFound();
                }

                return Ok(updatedSpecialization);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        // DELETE: api/specializations/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult<SpecializationDto>> SoftDelete(string id)
        {
            var specialization = await _service.InactivateAsync(new SpecializationId(id));

            if (specialization == null)
            {
                return NotFound();
            }

            return Ok(specialization);
        }

        // DELETE: api/operationTypeSpecializations/{id}/hard
        [HttpDelete("{id}/hard")]
        public async Task<ActionResult<SpecializationDto>> HardDelete(string id)
        {
            try
            {
                var deletedSpecialization = await _service.DeleteAsync(new SpecializationId(id));

                if (deletedSpecialization == null)
                {
                    return NotFound();
                }

                return Ok(deletedSpecialization);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
}
