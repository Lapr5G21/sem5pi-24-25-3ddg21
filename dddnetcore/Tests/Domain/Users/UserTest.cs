using System;
using Xunit;
using DDDSample1.Domain.Users;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Tests.Domain.Users
{
    public class UserTest
    {
        [Fact]
        public void CreateValidUserTest()
        {
            var role = new Role(RoleType.Doctor);
            var email = new Email("doctor@example.com");
            var username = new Username("D20230001@healthcare.com");
            var user = new User(role, email, username);

            Assert.Equal(role, user.Role);
            Assert.Equal(email, user.Email);
            Assert.Equal(username, user.Id);
            Assert.True(user.Active);
        }

        [Fact]
        public void ChangeUserRoleTest()
        {
            var role = new Role(RoleType.Nurse);
            var email = new Email("nurse@example.com");
            var username = new Username("N20230001@healthcare.com");
            var user = new User(role, email, username);

            var newRole = new Role(RoleType.Doctor);
            user.ChangeRole(newRole);

            Assert.Equal(newRole, user.Role);
        }

        [Fact]
        public void ChangeUserWhenInactiveTest()
        {
            var role = new Role(RoleType.Doctor);
            var email = new Email("doctor@example.com");
            var username = new Username("D20230001@healthcare.com");
            var user = new User(role, email, username);

            user.DeactivateUser();

            Assert.Throws<BusinessRuleValidationException>(() => user.ChangeRole(new Role(RoleType.Doctor)));
        }

        [Fact]
        public void DeactivateUserTest()
        {
            var role = new Role(RoleType.Doctor);
            var email = new Email("doctor@example.com");
            var username = new Username("D20230001@healthcare.com");
            var user = new User(role, email, username);

            user.DeactivateUser();

            Assert.False(user.Active);
        }
    }
}
