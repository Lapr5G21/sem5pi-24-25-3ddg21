using System;
using Xunit;
using DDDSample1.Domain.Patients;

namespace DDDSample1.Tests.Domain.Patients
{
    public class PatientEmergencyContactTests
    {
        [Fact]
        public void Constructor_ValidEmergencyContact_ShouldSetEmergencyContact()
        {
            string validContact1 = "912345678";
            string validContact2 = "932345678";
            string validContact3 = "962345678";

            var emergencyContact1 = new PatientEmergencyContact(validContact1);
            var emergencyContact2 = new PatientEmergencyContact(validContact2);
            var emergencyContact3 = new PatientEmergencyContact(validContact3);

            Assert.Equal(validContact1, emergencyContact1.EmergencyContact);
            Assert.Equal(validContact2, emergencyContact2.EmergencyContact);
            Assert.Equal(validContact3, emergencyContact3.EmergencyContact);
        }


        [Fact]
        public void IsValidEmergencyContact_InvalidContact_ShouldReturnFalse()
        {
            string invalidContact1 = "812345678";
            string invalidContact2 = "123456789";
            string invalidContact3 = "96234";

            bool result1 = PatientEmergencyContact.IsValidEmergencyContact(invalidContact1);
            bool result2 = PatientEmergencyContact.IsValidEmergencyContact(invalidContact2);
            bool result3 = PatientEmergencyContact.IsValidEmergencyContact(invalidContact3);

            Assert.False(result1);
            Assert.False(result2);
            Assert.False(result3);
        }

        [Fact]
        public void ToString_ShouldReturnEmergencyContact()
        {
            string contact = "912345678";
            var emergencyContact = new PatientEmergencyContact(contact);

            string result = emergencyContact.ToString();

            Assert.Equal(contact, result);
        }
    }
}
