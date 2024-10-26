using System;
using System.Collections.Generic;
using DDDSample1.Domain.Staffs;
using Xunit;

namespace DDDSample1.Domain.Staffs.Tests
{
    public class StaffPhoneNumberTest
    {
        [Fact]
        public void ConstructorValidPhoneNumberCreatesInstanceTest()
        {
            var validPhoneNumber = "912345678";

            var phoneNumber = new StaffPhoneNumber(validPhoneNumber);

            Assert.NotNull(phoneNumber);
            Assert.Equal(validPhoneNumber, phoneNumber.PhoneNumberString);
        }

        [Fact]
        public void ConstructorValidPhoneNumbersDoesNotThrowTest()
        {
            var validPhoneNumbers = new List<string>
            {
                "912345678",
                "913456789",
                "914567890",
                "915678901",
                "916789012",
                "917890123",
                "918901234",
                "919012345"
            };

            foreach (var validPhoneNumber in validPhoneNumbers)
            {
                var exception = Record.Exception(() => new StaffPhoneNumber(validPhoneNumber));
                Assert.Null(exception);
            }
        }

        [Fact]
        public void ConstructorInvalidPhoneNumberTest()
        {
            var invalidPhoneNumbers = new List<string>
            {
                "012345678",
                "812345678",
                "91234567",
                "9123456789",
                "A12345678",
                "",
                
            };

            foreach (var invalidPhoneNumber in invalidPhoneNumbers)
            {
                var exception = Assert.Throws<ArgumentException>(() => new StaffPhoneNumber(invalidPhoneNumber));
                Assert.Equal("The phone number introduced is not portuguese or is invalid", exception.Message);
            }
        }

        [Fact]
        public void IsValidPhoneNumberTest()
        {
            var phoneNumbersToTest = new Dictionary<string, bool>
            {
                { "912345678", true },
                { "914567890", true },
                { "919012345", true },
                { "91234567", false },
                { "A12345678", false },
                { "000000000", false }
            };

            foreach (var kvp in phoneNumbersToTest)
            {
                var result = StaffPhoneNumber.IsValidPhoneNumber(kvp.Key);
                Assert.Equal(kvp.Value, result);
            }
        }
    }
}