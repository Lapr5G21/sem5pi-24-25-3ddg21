using System;
using DDDSample1.Domain.Users;

namespace DDDSample1.Domain.Users
{
    public class CreatingUserDto
    {
        public string Role { get; set; }
        public string Email { get; set; }
        public string Password  {get; set;}
 

        public CreatingUserDto(string role, string email,string password)
        {
            this.Role = role;
            this.Email = email;
            this.Password = password;
        }
    }
}