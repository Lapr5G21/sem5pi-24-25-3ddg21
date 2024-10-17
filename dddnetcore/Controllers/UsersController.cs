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
        public async Task<ActionResult<UserDto>> Create([FromBody] CreatingUserDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Invalid data.");
            }

            var user = await _service.AddAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = user.Username }, user);
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
            var user = await _service.InactivateAsync(new Username(id));

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
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
                    return NotFound();
                }

                return Ok(deletedUser);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
}
