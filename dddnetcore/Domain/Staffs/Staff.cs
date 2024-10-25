using System;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Specializations;
using DDDSample1.Domain.Users;

namespace DDDSample1.Domain.Staffs
{
    public class Staff : Entity<StaffId>, IAggregateRoot
    {
        public StaffFirstName StaffFirstName { get; private set; }
        public StaffLastName StaffLastName { get; private set; }
        public StaffFullName StaffFullName { get; private set; }
        public StaffLicenseNumber StaffLicenseNumber { get; private set; }
        public SpecializationId SpecializationId { get; private set; }
        public StaffEmail StaffEmail { get; private set; }
        public StaffPhoneNumber StaffPhoneNumber { get; private set; }
        public StaffAvailabilitySlots StaffAvailabilitySlots { get; private set; }
        public Username UserId { get; private set; }

        public bool Active { get; private set; }

        private Staff()
        {
            this.Active = true;
        }

        public Staff(StaffId staffId, StaffFirstName staffFirstName, StaffLastName staffLastName, StaffFullName staffFullName, StaffLicenseNumber licenseNumber, SpecializationId specializationId, StaffEmail staffEmail, StaffPhoneNumber staffPhoneNumber, Username userId, StaffAvailabilitySlots staffAvailabilitySlots)
        {
            this.Active = true;
            this.Id = staffId;
            this.StaffFirstName = staffFirstName;
            this.StaffLastName = staffLastName;
            this.StaffFullName = staffFullName;
            this.StaffLicenseNumber = licenseNumber;
            this.SpecializationId = specializationId;
            this.StaffEmail = staffEmail;
            this.StaffPhoneNumber = staffPhoneNumber;
            this.StaffAvailabilitySlots = staffAvailabilitySlots;
            this.UserId = userId;
        }

        public void ChangeFirstName(StaffFirstName newFirstName)
        {
            if (!this.Active)
                throw new InvalidOperationException("Cannot modify an inactive staff member.");

            this.StaffFirstName = newFirstName ?? throw new ArgumentNullException(nameof(newFirstName));
        }

        public void ChangeLastName(StaffLastName newLastName)
        {
            if (!this.Active)
                throw new InvalidOperationException("Cannot modify an inactive staff member.");

            this.StaffLastName = newLastName ?? throw new ArgumentNullException(nameof(newLastName));
        }

        public void ChangeFullName(StaffFullName newFullName)
        {
            if (!this.Active)
                throw new InvalidOperationException("Cannot modify an inactive staff member.");

            this.StaffFullName = newFullName ?? throw new ArgumentNullException(nameof(newFullName));
        }

        public void ChangeEmail(StaffEmail newEmail)
        {
            if (!this.Active)
                throw new InvalidOperationException("Cannot modify an inactive staff member.");

            this.StaffEmail = newEmail ?? throw new ArgumentNullException(nameof(newEmail));
        }

        public void ChangePhoneNumber(StaffPhoneNumber newPhoneNumber)
        {
            if (!this.Active)
                throw new InvalidOperationException("Cannot modify an inactive staff member.");

            this.StaffPhoneNumber = newPhoneNumber ?? throw new ArgumentNullException(nameof(newPhoneNumber));
        }

        public void ChangeSpecialization(SpecializationId newSpecializationId)
        {
            if (!this.Active)
                throw new InvalidOperationException("Cannot modify an inactive staff member.");

            this.SpecializationId = newSpecializationId ?? throw new ArgumentNullException(nameof(newSpecializationId));
        }

        public void ChangeAvailabilitySlots(StaffAvailabilitySlots newAvailabilitySlots)
        {
            if (!this.Active)
                throw new InvalidOperationException("Cannot modify availability slots of an inactive staff member.");

            this.StaffAvailabilitySlots = newAvailabilitySlots ?? throw new ArgumentNullException(nameof(newAvailabilitySlots));
        }

        public void Deactivate()
        {
            this.Active = false;
        }

        public void Reactivate()
        {
            this.Active = true;
        }
    }
}
