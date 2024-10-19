using System;
using Xunit;
using DDDSample1.Domain.Users;

namespace DDDSample1.Tests.Domain.Users
{
    public class RoleTest
    {
        [Fact]
        public void CreateValidRoleTest()
        {
            var role = new Role(RoleType.Doctor);
            Assert.Equal(RoleType.Doctor, role.RoleValue);
        }
    }
}
