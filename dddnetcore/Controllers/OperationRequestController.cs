using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.OperationTypesSpecializations;
using Azure;
using DDDSample1.Domain.OperationRequest;
using DDDSample1.Domain.OperationRequestsx;
using Microsoft.AspNetCore.Authorization;
using DDDSample1.Domain.Staffs;

namespace DDDSample1.Controllers
{

[Route("api/operationRequests")]
    [ApiController]

    public class OperationRequestController : ControllerBase
    {

        private readonly OperationRequestService _service;

        public OperationRequestController(OperationRequestService service){

            _service = service;
        }


        // GET: api/operationRequests List Of Operation Requests
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OperationRequest>>> GetAll(){

            var operationRequests  = await _service.GetAllAsync();
            return Ok(operationRequests);
        }

        //GET: api/operationRequests/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<OperationRequestDto>> GetById(string id){

            var operationRequest = await _service.GetByIdAsync(new OperationRequestId(id));

            if(operationRequest == null){
                return NotFound();
            }

            return Ok(operationRequest);
        }

        [Authorize(Policy="DoctorRole")]
        [Authorize(Policy="AdminRole")]
        [HttpGet("search")]
        public async Task<IActionResult> SearchOperationRequest([FromQuery] string pacientMedicalRecordNumber, [FromQuery] Guid operationTypeId, [FromQuery] string priority, string status){

            try 
            {
                var searchDTo = new SearchOperationRequestDto{
                    PatientMedicalRecordNumber = pacientMedicalRecordNumber,
                    OperationTypeId = operationTypeId,
                    Priority = priority,
                    Status = status
                };

                var operationRequests = await _service.SearchOperationRequestAsync(searchDTo);
                return Ok(operationRequests); 
            }
            catch (Exception ex)
            {
                   return BadRequest($"An error occurred while searching: {ex.Message}");
            }
        }



        //POST: api/operationRequests
        [HttpPost]
        //[Authorize(Policy="DoctorRole")]
        public async Task<ActionResult<OperationRequestDto>> Create([FromBody] CreatingOperationRequestDto dto){

            if (dto == null)
            {
                return BadRequest("Invalid data.");
            }

            var operationRequest = await _service.AddAsync(dto);


            return CreatedAtAction(
                nameof(GetById),
                 new { id = operationRequest.Id},
                  operationRequest
            );
        }
        


        [Authorize(Policy="DoctorRole")]
        [HttpPut("{id}")]
        public async Task<ActionResult<OperationRequestDto>> Update(string id, [FromBody] OperationRequestDto dto)
        {
            if (id != dto.Id.ToString())
            {
                return BadRequest("ID mismatch.");
            }

            try
            {

                var updatedOperationRequest = await _service.UpdateAsync(dto);

                if (updatedOperationRequest == null)
                {
                    return NotFound();
                }

                return Ok(updatedOperationRequest);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }



        // DELETE: api/operationRequests/{id}/delete
        //[Authorize(Policy="DoctorRole")]
        [HttpDelete("{id}/delete")]
        public async Task<ActionResult<OperationRequestDto>> Delete(string id)
        {
            try
            {

                var deletedOperationRequest = await _service.DeleteAsync(new OperationRequestId(id));

                if (!deletedOperationRequest)
                {
                    return NotFound();
                }

                return Ok(deletedOperationRequest);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }



    }

}