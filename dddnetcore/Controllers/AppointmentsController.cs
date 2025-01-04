using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain.Appointments;
using DDDSample1.Domain.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DDDSample1.Controllers{

    [Route("api/appointments")]
    [ApiController]

    public class AppointmentsController : ControllerBase{

        private readonly AppointmentService _service;

        public  AppointmentsController(AppointmentService service){
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetAll()
        {
            return await _service.GetAllAsync();
        }

        // GET: api/appointments/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<AppointmentDto>> GetById(Guid id)
        {
            var appointment = await _service.GetByIdAsync(new AppointmentId(id));

            if (appointment == null)
            {
                return NotFound($"Not Found appointment with id: {id}");
            }

            return appointment;
        }

        // POST: api/appointments
        //[Authorize(Policy="DoctorRole")]
        [HttpPost]
        public async Task<ActionResult<AppointmentDto>> Create(CreatingAppointmentDto dto)
        {
            try{
                var appointment = await _service.AddAsync(dto);

                return StatusCode(201, appointment);

            }catch(BusinessRuleValidationException exception){
                
                return BadRequest(new {exception.Message});
            }catch(NullReferenceException exception){
                
                return NotFound(new {exception.Message});
            }catch(Exception){
                
                return StatusCode(500, new { message = "An unexpected error occurred." });
            }
        }

         // PUT: api/appointments/{id}
         //[Authorize(Policy="DoctorRole")]
        [HttpPut("{id}")]
        public async Task<ActionResult<AppointmentDto>> Update(string id, [FromBody] UpdateAppointmentDto dto)
        {
            Console.WriteLine(id);
            try
            {
                var updatedAppointment = await _service.UpdateAsync(dto);

                if (updatedAppointment == null)
                {
                    return NotFound();
                }

                return Ok(updatedAppointment);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }


        [HttpGet("staffs")]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetAppointmentStaffs()
        {
            return await _service.GetAllAsync();
        }
    }
}