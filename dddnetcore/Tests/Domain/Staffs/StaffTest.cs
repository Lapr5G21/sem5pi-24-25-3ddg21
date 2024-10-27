using System;
using Xunit;
using DDDSample1.Domain.Staffs;
using DDDSample1.Domain.Specializations;
using DDDSample1.Domain.Users;

namespace DDDSample1.Tests.Domain.Staffs
{
    public class StaffTests
    {
        private readonly Staff _staff;

        public StaffTests()
        {
            _staff = new Staff(
                new StaffId("D20240002"),
                new StaffFirstName("Joao"),
                new StaffLastName("Oliveira"),
                new StaffFullName("Joao Oliveira"),
                new StaffLicenseNumber("LN123"),
                new SpecializationId(Guid.NewGuid()),
                new StaffEmail("1221957@test.pt"),
                new StaffPhoneNumber("912423957"),
                new Username("D20240002@healtcare.comt"),
                new StaffAvailabilitySlots("[{\"Start\":\"2024-10-30T14:00:00\",\"End\":\"2024-10-30T18:00:00\"}]")
            );
        }

        [Fact]
        public void ChangeFirstName_ShouldUpdateFirstName()
        {
            var newFirstName = new StaffFirstName("Bruno");

            _staff.ChangeFirstName(newFirstName);

            Assert.Equal(newFirstName, _staff.StaffFirstName);
        }

        [Fact]
        public void ChangeFirstName_ShouldThrowException_WhenStaffIsInactive()
        {
            _staff.Deactivate();
            var newFirstName = new StaffFirstName("Bruno");

            Assert.Throws<InvalidOperationException>(() => _staff.ChangeFirstName(newFirstName));
        }

        [Fact]
        public void ChangeLastName_ShouldUpdateLastName()
        {
            var newLastName = new StaffLastName("Silva");

            _staff.ChangeLastName(newLastName);

            Assert.Equal(newLastName, _staff.StaffLastName);
        }

        [Fact]
        public void ChangeLastName_ShouldThrowException_WhenStaffIsInactive()
        {
            _staff.Deactivate();
            var newLastName = new StaffLastName("Silva");

            Assert.Throws<InvalidOperationException>(() => _staff.ChangeLastName(newLastName));
        }

        [Fact]
        public void ChangeFullName_ShouldUpdateFullName()
        {
            var newFullName = new StaffFullName("Bruno Silva");

            _staff.ChangeFullName(newFullName);

            Assert.Equal(newFullName, _staff.StaffFullName);
        }

        [Fact]
        public void ChangeFullName_ShouldThrowException_WhenStaffIsInactive()
        {
            _staff.Deactivate();
            var newFullName = new StaffFullName("Bruno Silva");

            Assert.Throws<InvalidOperationException>(() => _staff.ChangeFullName(newFullName));
        }

        [Fact]
        public void ChangeEmail_ShouldUpdateEmail()
        {
            var newEmail = new StaffEmail("bruno.silva@test.pt");

            _staff.ChangeEmail(newEmail);

            Assert.Equal(newEmail, _staff.StaffEmail);
        }

        [Fact]
        public void ChangeEmail_ShouldThrowException_WhenStaffIsInactive()
        {
            _staff.Deactivate();
            var newEmail = new StaffEmail("bruno.silva@test.pt");

            Assert.Throws<InvalidOperationException>(() => _staff.ChangeEmail(newEmail));
        }

        [Fact]
        public void ChangePhoneNumber_ShouldUpdatePhoneNumber()
        {
            var newPhoneNumber = new StaffPhoneNumber("913555444");

            _staff.ChangePhoneNumber(newPhoneNumber);

            Assert.Equal(newPhoneNumber, _staff.StaffPhoneNumber);
        }

        [Fact]
        public void ChangePhoneNumber_ShouldThrowException_WhenStaffIsInactive()
        {
            _staff.Deactivate();
            var newPhoneNumber = new StaffPhoneNumber("913555444");

            Assert.Throws<InvalidOperationException>(() => _staff.ChangePhoneNumber(newPhoneNumber));
        }

        [Fact]
        public void ChangeSpecialization_ShouldUpdateSpecialization()
        {
            var newSpecializationId = new SpecializationId(Guid.NewGuid());

            _staff.ChangeSpecialization(newSpecializationId);

            Assert.Equal(newSpecializationId, _staff.SpecializationId);
        }

        [Fact]
        public void ChangeSpecialization_ShouldThrowException_WhenStaffIsInactive()
        {
            _staff.Deactivate();
            var newSpecializationId = new SpecializationId(Guid.NewGuid());

            Assert.Throws<InvalidOperationException>(() => _staff.ChangeSpecialization(newSpecializationId));
        }

        [Fact]
        public void ChangeAvailabilitySlots_ShouldUpdateAvailabilitySlots()
        {
            var newAvailabilitySlots = new StaffAvailabilitySlots("[{\"Start\":\"2024-10-31T14:00:00\",\"End\":\"2024-10-31T18:00:00\"}]");

            _staff.ChangeAvailabilitySlots(newAvailabilitySlots);

            Assert.Equal(newAvailabilitySlots, _staff.StaffAvailabilitySlots);
        }

        [Fact]
        public void ChangeAvailabilitySlots_ShouldThrowException_WhenStaffIsInactive()
        {
            _staff.Deactivate();
            var newAvailabilitySlots = new StaffAvailabilitySlots("[{\"Start\":\"2024-10-31T14:00:00\",\"End\":\"2024-10-31T18:00:00\"}]");

            Assert.Throws<InvalidOperationException>(() => _staff.ChangeAvailabilitySlots(newAvailabilitySlots));
        }

        [Fact]
        public void Deactivate_ShouldSetStaffInactive()
        {
            _staff.Deactivate();

            Assert.False(_staff.Active);
        }

        [Fact]
        public void Reactivate_ShouldSetStaffActive()
        {
            _staff.Deactivate();

            _staff.Reactivate();

            Assert.True(_staff.Active);
        }
    }
}
