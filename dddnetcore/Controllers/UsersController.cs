using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;
using System.Threading.Tasks;
using DDDSample1.Domain.Users;
using DDDSample1.Domain.Shared;
using DDDSample1.Users;
using Microsoft.AspNetCore.Authorization;

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
        public async Task<ActionResult<UserDto>> CreateBackofficeUser([FromBody] CreatingUserDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Invalid user data.");
            }

            var userDto = await _service.AddBackofficeUserAsync(dto);
            if (userDto == null)
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }


            return CreatedAtAction(nameof(GetById), new { id = userDto.Username }, userDto); 
        }

        // POST: api/users/patients
        [HttpPost("patients")]
        public async Task<ActionResult<UserDto>> CreatePatientUser([FromBody] CreatingPatientUserDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Invalid user data.");
            }

            var userDto = await _service.AddPatientUserSync(dto);
            if (userDto == null)
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }


            return CreatedAtAction(nameof(GetById), new { id = userDto.Username }, userDto); 
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] RequestLoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var loginResult = await _service.LoginAsync(loginDto);
                return Ok(loginResult);
            }
            catch (Exception ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        // PUT: api/users/{id}
        [HttpPut("{id}")]
        [Authorize(Policy="PatientRole")]
        [Authorize(Policy="AdminRole")]
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


        [HttpDelete("{id}")]
        [Authorize(Policy="PatientRole")]
        public async Task<ActionResult<UserDto>> RequestDelete(string id)
        {
            var result = await _service.DeleteAsync(new Username(id));
            if (result)
            {
                return Ok(new { message = "Confirmation email sent. Please check your inbox." });
            }
            return NotFound(new { message = "User not found." });
        }

        [HttpGet("confirm-delete/{id}")]
         public async Task<IActionResult> ConfirmDeletion(string id)
        {
            var deletedUser = await _service.ConfirmDeletionAsync(new Username(id));
            if (deletedUser != null)
        {
            return Ok(new { message = "User successfully deleted.", user = deletedUser });
        }
        return NotFound(new { message = "User not found." });
        }


        [Authorize(Policy="BackofficeRole")]
        [HttpPost("reset-password")]
        public async Task<ActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
        {
            if (resetPasswordDto == null || string.IsNullOrEmpty(resetPasswordDto.Email))
            {
                return BadRequest("Email required.");
            }

            try
            {
                await _service.ResetPasswordAsync(resetPasswordDto.Email);
                return Ok("Reset Password Email sent.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
