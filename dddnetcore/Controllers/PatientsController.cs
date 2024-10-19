using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;
using System.Threading.Tasks;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;

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

        // GET: api/users/{id}
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

        // POST: api/users
        [HttpPost]
        public async Task<ActionResult<PatientDto>> Create([FromBody] CreatingPatientDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Invalid patient profile data.");
            }

            Console.WriteLine("Creating patient profile: " + dto.Email); // Example logging

            var patientDto = await _service.AddAsync(dto);
            if (patientDto == null)
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            // Verifique o valor do Email
            Console.WriteLine("Created patient medical record number: " + patientDto.MedicalRecordNumber);

            return CreatedAtAction(nameof(GetById), new { id = patientDto.MedicalRecordNumber }, patientDto); // Alterado para 'id'
        }

    }
}