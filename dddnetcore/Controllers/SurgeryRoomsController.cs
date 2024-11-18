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
    }
}