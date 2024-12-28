using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.RoomTypes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DDDSample1.Controllers
{
    [Route("api/roomTypes")]
    [ApiController]
    public class RoomTypesController : ControllerBase
    {
        private readonly RoomTypeService _service;

        public RoomTypesController(RoomTypeService service) {
            this._service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoomTypeDto>>> GetRoomTypes() {
            return await _service.GetAllAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RoomTypeDto>> GetById(string id) {
            var roomType = await _service.GetByIdAsync(new RoomTypeCode(id));

            if (roomType == null)
                return NotFound();

                return roomType;
        }

        [HttpPost]
        //[Authorize(Policy = "AdminRole")]
        public async Task<ActionResult<RoomTypeDto>> Create([FromBody] CreatingRoomTypeDto dto)
        {
            try{
                var roomType = await _service.AddAsync(dto);

                return CreatedAtAction(nameof(GetById), new { id = roomType.Code }, roomType);

            }catch(BusinessRuleValidationException exception){
                
                return BadRequest(new {exception.Message});
            }catch(NullReferenceException exception){
                
                return NotFound(new {exception.Message});
            }catch(Exception){
                
                return StatusCode(500, new { message = "An unexpected error occurred." });
            }
        }

        // DELETE: api/roomTypes/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult<RoomTypeDto>> HardDelete(string id)
        {
            try
            {
                var deletedRoomType = await _service.DeleteAsync(new RoomTypeCode(id));

                if (deletedRoomType == null)
                {
                    return NotFound();
                }

                return Ok(deletedRoomType);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
}