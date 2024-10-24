using System;
using System.Collections;
using System.Collections.Generic;
using System.Security.Claims;

namespace DDDSample1.Domain.Users
{
    public class LoginUserDto
{
    public string LoginToken { get; set; }
    public List<string> Roles { get; set; }
}
}