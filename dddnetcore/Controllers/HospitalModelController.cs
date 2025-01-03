
using DDDSample1.Domain.Appointments;
using DDDSample1.Domain.Hospital;
using DDDSample1.Domain.SurgeryRooms;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace dddnetcore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HospitalModelController : ControllerBase
    {
        private readonly HospitalModelService _hospitalModelService;

        public HospitalModelController(HospitalModelService hospitalModelService)
        {
            _hospitalModelService = hospitalModelService;
        }

        //GET: api/hospitalModel
        [HttpGet]
        public async Task<IActionResult> GetHospitalMap()
        {
            var map = await _hospitalModelService.GetHospitalMap();
            return Ok(map);
        }

        //GET: api/hospitalModel/currentAppointment
        [HttpGet("/currentAppointment/{surgeryRoomId}")]
        public async Task<IActionResult> GetCurrentAppointment(string surgeryRoomId)
        {
            if (string.IsNullOrWhiteSpace(surgeryRoomId))
            {
                return BadRequest("SurgeryRoomId cannot be null or empty.");
            }

            var currentAppointment = await _hospitalModelService.GetCurrentAppointmentsByRoomIdAsync(new SurgeryRoomNumber(surgeryRoomId));

            if (currentAppointment == null)
            {
                return NotFound($"No ongoing appointment found for room {surgeryRoomId}.");
            }

            return Ok(currentAppointment);
        }
    }
}