using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.OperationTypesSpecializations;

namespace DDDSample1.Controllers
{
    [Route("api/operationTypes")]
    [ApiController]
    public class OperationTypesController : ControllerBase
    {
        private readonly OperationTypeService _service;

        public OperationTypesController(OperationTypeService service)
        {
            _service = service;
        }

        // GET: api/operationTypes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OperationTypeDto>>> GetAll()
        {
            var operationTypes = await _service.GetAllAsync();
            return Ok(operationTypes);
        }

        // GET: api/operationTypes/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<OperationTypeDto>> GetById(string id)
        {
            var operationType = await _service.GetByIdAsync(new OperationTypeId(id));

            if (operationType == null)
            {
                return NotFound();
            }

            return Ok(operationType);
        }

        // POST: api/operationTypes
        [HttpPost]
        public async Task<ActionResult<OperationTypeDto>> Create([FromBody] CreatingOperationTypeDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Invalid data.");
            }

            var operationType = await _service.AddAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = operationType.Id }, operationType);
        }

        // PUT: api/operationTypes/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<OperationTypeDto>> Update(string id, [FromBody] OperationTypeDto dto)
        {
            if (id != dto.Id.ToString())
            {
                return BadRequest("ID mismatch.");
            }

            try
            {
                var updatedOperationType = await _service.UpdateAsync(dto);

                if (updatedOperationType == null)
                {
                    return NotFound();
                }

                return Ok(updatedOperationType);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        // DELETE: api/operationTypes/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult<OperationTypeDto>> SoftDelete(string id)
        {
            var operationType = await _service.InactivateAsync(new OperationTypeId(id));

            if (operationType == null)
            {
                return NotFound();
            }

            return Ok(operationType);
        }

        // DELETE: api/operationTypes/{id}/hard
        [HttpDelete("{id}/hard")]
        public async Task<ActionResult<OperationTypeDto>> HardDelete(string id)
        {
            try
            {
                var deletedOperationType = await _service.DeleteAsync(new OperationTypeId(id));

                if (deletedOperationType == null)
                {
                    return NotFound();
                }

                return Ok(deletedOperationType);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
}