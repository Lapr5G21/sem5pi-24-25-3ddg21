using System;
using DDDSample1.Domain.Users;

namespace DDDSample1.Domain.Users
{
    public class CreatingPatientUserDto
    {
        public string Email { get; set; }
        public string Username {get;set;}
        public string Password {get; set; }
 

        public CreatingPatientUserDto(string email,string password, string username)
        {
            this.Email = email;
            this.Username = username;
            this.Password= password;
        }
    }
}