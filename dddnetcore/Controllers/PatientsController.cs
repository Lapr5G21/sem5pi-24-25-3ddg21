using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;
using System.Threading.Tasks;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;
using Microsoft.AspNetCore.Authorization;

namespace DDDSample1.Controllers
{
    [Route("api/patients")]
    [ApiController]
    public class PatientsController : ControllerBase
    {
        private readonly PatientService _service;

        public PatientsController(PatientService service)
        {
            _service = service;
        }

        // GET: api/patients
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PatientDto>>> GetAll()
        {
            var patients = await _service.GetAllAsync();
            return Ok(patients);
        }

        // GET: api/patients/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<PatientDto>> GetById(string id)
        {
            var patient = await _service.GetByIdAsync(new PatientMedicalRecordNumber(id));

            if (patient == null)
            {
                return NotFound();
            }

            return Ok(patient);
        }

        // POST: api/patients
        [Authorize(Policy="AdminRole")]
        [HttpPost]
        public async Task<ActionResult<PatientDto>> Create([FromBody] CreatingPatientDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Invalid patient profile data.");
            }

            Console.WriteLine("Creating patient profile: " + dto.Email); // Example logging

            var patient = await _service.AddAsync(dto);
            if (patient == null)
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            return CreatedAtAction(nameof(GetById), new { id = patient.MedicalRecordNumber }, patient); 
        }


        // PUT: api/patients/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<PatientDto>> Update(string id, [FromBody] EditingPatientDto dto)
        {
            Console.WriteLine(id);
            Console.WriteLine(dto.MedicalRecordNumber);
            if (id != dto.MedicalRecordNumber)
            {
                return BadRequest("ID mismatch.");
            }

            try
            {
                var updatedPatient = await _service.UpdateAsync(dto);

                if (updatedPatient == null)
                {
                    return NotFound();
                }

                return Ok(updatedPatient);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }


        // DELETE: api/patients/{id}
        [Authorize(Policy="AdminRole")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<PatientDto>> HardDelete(string id)
        {
            try
            {
                var deletedPatient = await _service.DeleteAsync(new PatientMedicalRecordNumber(id));

                if (deletedPatient == null)
                {
                    return NotFound();
                }

                return Ok(deletedPatient);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

            [HttpGet("search")]
            public async Task<IActionResult> SearchPatients([FromQuery] string fullName, [FromQuery] string birthDate, [FromQuery] string gender, [FromQuery] string email, [FromQuery] string phoneNumber, [FromQuery] string mrn, [FromQuery] bool? isActive)
            {      
                try
                {
                    var searchDto = new SearchPatientDto
                {
                    FullName = fullName,
                    BirthDate = birthDate,
                    Gender = gender,
                    Email = email,
                    PhoneNumber = phoneNumber,
                    MedicalRecordNumber = mrn,
                    Active = isActive
                };

                var patients = await _service.SearchPatientsAsync(searchDto);
                return Ok(patients);
                }
                catch (Exception ex)
                {
                    return BadRequest($"An error occurred while searching: {ex.Message}");
                }
            }

            [HttpGet("by-email")]
            public async Task<IActionResult> GetByEmail([FromQuery] string email)
            {
                if (string.IsNullOrEmpty(email))
                {
                    return BadRequest("O e-mail não pode ser vazio.");
                }

                var patient = await _service.GetByEmailAsync(email);

                if (patient == null)
                {
                    return NotFound("Paciente não encontrado.");
                }

                return Ok(patient);
            }
    }
}