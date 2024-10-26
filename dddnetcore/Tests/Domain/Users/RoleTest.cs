using Xunit;
using DDDSample1.Domain.Users;

namespace DDDSample1.Tests.Domain.Users
{
    public class RoleTest
    {
        [Theory]
        [InlineData(RoleType.Admin, "Admin")]
        [InlineData(RoleType.Doctor, "Doctor")]
        [InlineData(RoleType.Nurse, "Nurse")]
        [InlineData(RoleType.Technician, "Technician")]
        [InlineData(RoleType.Patient, "Patient")]
        public void Role_ShouldInitializeCorrectly(RoleType roleType, string expectedString)
        {
            var role = new Role(roleType);

            Assert.Equal(roleType, role.RoleValue);
            Assert.Equal(expectedString, role.ToString());
        }

        [Fact]
        public void Roles_ShouldReturnExpectedStaticInstances()
        {
            Assert.Equal(RoleType.Admin, Roles.Admin.RoleValue);
            Assert.Equal("Admin", Roles.Admin.ToString());

            Assert.Equal(RoleType.Doctor, Roles.Doctor.RoleValue);
            Assert.Equal("Doctor", Roles.Doctor.ToString());

            Assert.Equal(RoleType.Nurse, Roles.Nurse.RoleValue);
            Assert.Equal("Nurse", Roles.Nurse.ToString());

            Assert.Equal(RoleType.Technician, Roles.Technician.RoleValue);
            Assert.Equal("Technician", Roles.Technician.ToString());

            Assert.Equal(RoleType.Patient, Roles.Patient.RoleValue);
            Assert.Equal("Patient", Roles.Patient.ToString());
        }
    }
}
