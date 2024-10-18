using System;
using DDDSample1.Domain.Users;

namespace DDDSample1.Domain.Users
{
    public class CreatingUserDto
    {
        public string Role { get; set; }
        public string Email { get; set; }
 

        public CreatingUserDto(string role, string email)
        {
            this.Role = role;
            this.Email = email;
        }
    }
}