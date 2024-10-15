using System;
using DDDSample1.Domain.Shared;
using DDDSample1.Users;
using Microsoft.Extensions.Configuration;

namespace DDDSample1.Domain.Users
{
    public class User : Entity<Username>, IAggregateRoot
    {
        public Username Username { get; private set; }
        public Role Role { get; private set; }
        public Email Email { get; private set; }
        public bool Active { get; private set; }

        private User()
        {
            this.Active = true;
        }

        public User(Role role, Email email,Username username)
        {
            this.Active = true;
            this.Email = email;
            this.Role = role;
            this.Username = username;
        }

        public void ChangeRole(Role role)
        {
            if (!this.Active) throw new BusinessRuleValidationException("User cannot be changed in this state");
            this.Role = role;
        }

        public void ChangeUsername(Username username)
        {
            if (!this.Active) throw new BusinessRuleValidationException("User cannot be changed in this state");
            this.Username = username;
        }

        public void ChangeEmail(Email email)
        {
            if (!this.Active) throw new BusinessRuleValidationException("User cannot be changed in this state");
            this.Email = email;
        }
    }
}