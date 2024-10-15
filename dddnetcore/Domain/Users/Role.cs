using DDDSample1.Domain.Shared;
using System.Collections.Generic;

namespace DDDSample1.Domain.Users
{
    public enum RoleType
    {
        Admin,
        Doctor,
        Nurse,
        Technician,
        Patient
    }

    public class Role : IValueObject
    {
        public RoleType RoleValue { get; private set; }

        public Role(RoleType value)
        {
            this.RoleValue = value;
        }

        public override string ToString() => RoleValue.ToString();
    }

    public static class Roles
    {
        public static Role Admin => new Role(RoleType.Admin);
        public static Role Doctor => new Role(RoleType.Doctor);
        public static Role Nurse => new Role(RoleType.Nurse);
        public static Role Technician => new Role(RoleType.Technician);
        public static Role Patient => new Role(RoleType.Patient);
    }
}