using System;
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

        [Theory]
        [InlineData("912345678")]
        [InlineData("913456789")]
        [InlineData("914567890")]
        [InlineData("915678901")]
        [InlineData("916789012")]
        [InlineData("917890123")]
        [InlineData("918901234")]
        [InlineData("919012345")]
        public void ConstructorValidPhoneNumbersDoesNotThrowTest(string validPhoneNumber)
        {
            var exception = Record.Exception(() => new StaffPhoneNumber(validPhoneNumber));
            Assert.Null(exception);
        }

        [Theory]
        [InlineData("012345678")]
        [InlineData("812345678")]
        [InlineData("91234567")]
        [InlineData("9123456789")]
        [InlineData("A12345678")]
        [InlineData("")]
        [InlineData(null)]
        public void ConstructorInvalidPhoneNumberTest(string invalidPhoneNumber)
        {
            var exception = Assert.Throws<ArgumentException>(() => new StaffPhoneNumber(invalidPhoneNumber));
            Assert.Equal("The phone number introduced is not Portuguese or is invalid", exception.Message);
        }

        [Theory]
        [InlineData("912345678", true)]
        [InlineData("91234567", false)]
        [InlineData("A12345678", false)]
        [InlineData("000000000", false)]
        [InlineData("914567890", true)]
        [InlineData("919012345", true)]
        public void IsValidPhoneNumberTest(string phoneNumber, bool expectedValidity)
        {
            var result = StaffPhoneNumber.IsValidPhoneNumber(phoneNumber);

            Assert.Equal(expectedValidity, result);
        }
    }
}
