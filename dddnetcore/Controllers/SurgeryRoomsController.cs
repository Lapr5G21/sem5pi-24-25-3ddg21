using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.SurgeryRooms;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DDDSample1.Controllers
{
    [Route("api/surgeryRooms")]
    [ApiController]
    public class SurgeryRoomsController : ControllerBase
    {
        private readonly SurgeryRoomService _service;

        public SurgeryRoomsController(SurgeryRoomService service) {
            this._service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SurgeryRoomDto>>> GetSurgeryRooms() {
            return await _service.GetAllAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SurgeryRoomDto>> GetById(string id) {
            var surgeryRoom = await _service.GetByIdAsync(new SurgeryRoomNumber(id));

            if (surgeryRoom == null)
                return NotFound();

                return surgeryRoom;
        }

        [HttpPost]
        public async Task<ActionResult<SurgeryRoomDto>> Create(CreatingSurgeryRoomDto dto)
        {
            try{
                var surgeryRoom = await _service.AddAsync(dto);

                return CreatedAtAction(nameof(GetById), new { id = surgeryRoom.Id }, surgeryRoom);

            }catch(BusinessRuleValidationException exception){
                
                return BadRequest(new {exception.Message});
            }catch(NullReferenceException exception){
                
                return NotFound(new {exception.Message});
            }catch(Exception){
                
                return StatusCode(500, new { message = "An unexpected error occurred." });
            }
        }
    

        // PUT: api/surgeryRooms/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<SurgeryRoomDto>> Update(string id, [FromBody] EditingSurgeryRoomDto dto)
        {
            Console.WriteLine(id);
            if (id != dto.Id)
            {
                return BadRequest("ID mismatch.");
            }

            try
            {
                var updatedSurgeryRoom = await _service.UpdateAsync(dto);

                if (updatedSurgeryRoom == null)
                {
                    return NotFound();
                }

                return Ok(updatedSurgeryRoom);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }


        // DELETE: api/surgeryRooms/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult<SurgeryRoomDto>> HardDelete(string id)
        {
            try
            {
                var deletedSurgeryRoom = await _service.DeleteAsync(new SurgeryRoomNumber(id));

                if (deletedSurgeryRoom == null)
                {
                    return NotFound();
                }

                return Ok(deletedSurgeryRoom);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }


        [HttpGet("search")]
            public async Task<IActionResult> SearchRooms([FromQuery] string id, [FromQuery] string roomTypeCode, [FromQuery] string maintenanceSlots, [FromQuery] string equipment, [FromQuery] string status)
            {      
                try
                {
                    var searchDto = new SearchSurgeryRoomDto
                {
                    Id = id,
                    RoomTypeCode = roomTypeCode,
                    MaintenanceSlots = maintenanceSlots,
                    Equipment = equipment,
                    Status = status,
                };

                var rooms = await _service.SearchRoomsAsync(searchDto);
                return Ok(rooms);
                }
                catch (Exception ex)
                {
                    return BadRequest($"An error occurred while searching: {ex.Message}");
                }
            }
    }
}