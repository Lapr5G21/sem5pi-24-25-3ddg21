using System;
using DDDSample1.Domain.OperationTypesSpecializations;
using Xunit;

namespace DDDSample1.Tests.Domain.OperationTypesSpecializations
{
    public class NumberOfStaffTests
    {
        [Fact]
        public void InvalidConstructorNegativeNumberTest()
        {
            int negativeNumber = -1;

            var exception = Assert.Throws<ArgumentException>(() => new NumberOfStaff(negativeNumber));
            Assert.Equal("Number of staff cannot be negative.", exception.Message);
        }
        [Fact]
        public void ValidConstructorTest()
        {
            int validNumber = 5;

            var numberOfStaff = new NumberOfStaff(validNumber);

            Assert.Equal(validNumber, numberOfStaff.GetStaffCount());
        }

       
        [Fact]
        public void GetStaffCountTest()
        {
            int staffCount = 10;
            var numberOfStaff = new NumberOfStaff(staffCount);

            var result = numberOfStaff.GetStaffCount();

            Assert.Equal(staffCount, result);
        }
    }
}
