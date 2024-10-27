using System;
using Xunit;
using DDDSample1.Domain.Staffs;

namespace DDDSample1.Tests.Domain.Staffs
{
    public class StaffIdTests
    {
        [Fact]
        public void StaffId_CreatesFromString_ShouldSetCorrectValue()
        {
            var input = "D20240002";
            
            var staffId = new StaffId(input);

            Assert.Equal(input, staffId.AsString());
            Assert.Equal(input, staffId.Value());
        }

        [Fact]
        public void StaffId_CreatesFromGuid_ShouldSetCorrectValue()
        {
            var guid = Guid.NewGuid();
            var expectedValue = guid.ToString();

            var staffId = new StaffId(guid);

            Assert.Equal(expectedValue, staffId.AsString());
            Assert.Equal(expectedValue, staffId.Value());
        }

        [Fact]
        public void StaffService_GeneratesStaffId_FromUserId_ShouldReturnCorrectStaffId()
        {
            var userId = "D20240002@healtcare.com";
            var expectedStaffId = "D20240002";

            var generatedStaffId = GenerateStaffIdFromUserId(userId);

            Assert.Equal(expectedStaffId, generatedStaffId.AsString());
        }

        private StaffId GenerateStaffIdFromUserId(string userId)
        {
            // Mimic the logic in the Staff service to split the userId and create StaffId
            var staffId = userId.Split('@')[0];
            return new StaffId(staffId);
        }
    }
}
