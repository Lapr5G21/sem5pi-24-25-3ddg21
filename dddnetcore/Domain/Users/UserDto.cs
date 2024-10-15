using System;
using System.Collections.Generic;
using DDDSample1.Domain.OperationTypesSpecializations;

namespace DDDSample1.Domain.Users
{
    public class UserDto
    {
        public string Username { get; set; }
        public string Role { get; set; }
        public string Email { get; set; }
    }
}