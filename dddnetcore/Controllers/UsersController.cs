using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;
using System.Threading.Tasks;
using DDDSample1.Domain.Users;
using DDDSample1.Domain.Shared;
using DDDSample1.Users;

namespace DDDSample1.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserService _service;

        public UsersController(UserService service)
        {
            _service = service;
        }

        // GET: api/users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAll()
        {
            var users = await _service.GetAllAsync();
            return Ok(users);
        }

        // GET: api/users/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetById(string id)
        {
            var user = await _service.GetByIdAsync(new Username(id));

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        // POST: api/users
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatingUserDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Invalid user data.");
            }

            Console.WriteLine("Creating user: " + dto.Email); // Example logging

            var userDto = await _service.AddAsync(dto);
            if (userDto == null)
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            // Verifique o valor do Username
            Console.WriteLine("Created user username: " + userDto.Username);

            return CreatedAtAction(nameof(GetById), new { id = userDto.Username }, userDto); // Alterado para 'id'
        }



        // PUT: api/users/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<UserDto>> Update(string id, [FromBody] UserDto dto)
        {
            if (id != dto.Username.ToString())
            {
                return BadRequest("ID mismatch.");
            }

            try
            {
                var updatedUser = await _service.UpdateAsync(dto);

                if (updatedUser == null)
                {
                    return NotFound();
                }

                return Ok(updatedUser);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        // DELETE: api/users/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult<UserDto>> SoftDelete(string id)
        {
            try
            {
                var user = await _service.InactivateAsync(new Username(id));

                if (user == null)
                {
                    return NotFound("User not found for soft delete.");
                }

                return Ok(user);
            }
            catch (Exception ex) // Captura qualquer exceção que pode ocorrer
            {
                return StatusCode(500, "An error occurred while soft deleting the user: " + ex.Message);
            }
        }

        // DELETE: api/users/{id}/hard
        [HttpDelete("{id}/hard")]
        public async Task<ActionResult<UserDto>> HardDelete(string id)
        {
            try
            {
                var deletedUser = await _service.DeleteAsync(new Username(id));

                if (deletedUser == null)
                {
                    return NotFound("User not found for hard delete.");
                }

                return Ok(deletedUser);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            catch (Exception ex) // Captura qualquer exceção que pode ocorrer
            {
                return StatusCode(500, "An error occurred while hard deleting the user: " + ex.Message);
            }
        }
    }
}