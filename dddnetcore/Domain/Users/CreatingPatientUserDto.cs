using System;
using DDDSample1.Domain.Users;

namespace DDDSample1.Domain.Users
{
    public class CreatingPatientUserDto
    {
        public string Email { get; set; }
        public string Password {get; set; }
 

        public CreatingPatientUserDto(string email,string password)
        {
            this.Email = email;
            this.Password= password;
        }
    }
}