using System;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Staffs;
using DDDSample1.Domain.Specializations;
using DDDSample1.Domain.Users;
using Xunit;

namespace DDDSample1.Domain.Staffs.Tests
{
    public class StaffTest
    {
        private readonly Staff _staff;

        public StaffTest()
        {
            var staffId = new StaffId(Guid.NewGuid().ToString());
            var specializationId = new SpecializationId("1");
            var userId = new Username("O20240001@healthcare.com");

            _staff = new Staff(
                staffId,
                new StaffFirstName("John"),
                new StaffLastName("Doe"),
                new StaffFullName("John Doe"),
                new StaffLicenseNumber("12345"),
                specializationId,
                new StaffEmail("john.doe@example.com"),
                new StaffPhoneNumber("912345678"),
                userId,
                new StaffAvailabilitySlots("9:00-17:00")
            );
        }

        [Fact]
        public void ChangeFirstNameTest()
        {
            var newFirstName = new StaffFirstName("Jane");
            _staff.ChangeFirstName(newFirstName);

            Assert.Equal(newFirstName, _staff.StaffFirstName);
        }

        [Fact]
        public void ChangeLastNameTest()
        {
            var newLastName = new StaffLastName("Smith");
            _staff.ChangeLastName(newLastName);

            Assert.Equal(newLastName, _staff.StaffLastName);
        }

        [Fact]
        public void ChangeFullNameTest()
        {
            var newFullName = new StaffFullName("Jane Smith");
            _staff.ChangeFullName(newFullName);

            Assert.Equal(newFullName, _staff.StaffFullName);
        }

        [Fact]
        public void ChangeEmailTest()
        {
            var newEmail = new StaffEmail("jane.smith@example.com");
            _staff.ChangeEmail(newEmail);

            Assert.Equal(newEmail, _staff.StaffEmail);
        }

        [Fact]
        public void ChangePhoneNumberTest()
        {
            var newPhoneNumber = new StaffPhoneNumber("912345679");
            _staff.ChangePhoneNumber(newPhoneNumber);

            Assert.Equal(newPhoneNumber, _staff.StaffPhoneNumber);
        }

        [Fact]
        public void DeactivateTest()
        {
            _staff.Deactivate();

            Assert.False(_staff.Active);
        }

        [Fact]
        public void ReactivateTest()
        {
            _staff.Deactivate();
            _staff.Reactivate();

            Assert.True(_staff.Active);
        }

        [Fact]
        public void ChangeFirstNameInactiveStaffTest()
        {
            _staff.Deactivate();

            Assert.Throws<InvalidOperationException>(() => _staff.ChangeFirstName(new StaffFirstName("Jane")));
        }
    }
}
