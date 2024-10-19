using Xunit;
using System;
using DDDSample1.Domain.Staffs;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Staffs.Tests
{
    public class StaffIdTest
    {
        [Fact]
        public void StaffIdConstructorWithGuidTest()
        {
            var guid = Guid.NewGuid();
            var staffId = new StaffId(guid);
            Assert.Equal(guid, staffId.AsGuid());
        }

        [Fact]
        public void StaffIdConstructorWithStringTest()
        {
            var guid = Guid.NewGuid();
            var staffId = new StaffId(guid.ToString());
            Assert.Equal(guid, staffId.AsGuid());
        }

        [Fact]
        public void StaffIdCreateFromStringTest()
        {
            var guid = Guid.NewGuid();
            var staffId = new StaffId(guid.ToString());
            Assert.Equal(guid.ToString(), staffId.AsString());
        }

        [Fact]
        public void StaffIdAsStringTest()
        {
            var guid = Guid.NewGuid();
            var staffId = new StaffId(guid);
            Assert.Equal(guid.ToString(), staffId.AsString());
        }

        [Fact]
        public void StaffIdEqualsTest()
        {
            var staffId1 = new StaffId(Guid.NewGuid());
            var staffId2 = new StaffId(staffId1.AsString());
            var staffId3 = new StaffId(Guid.NewGuid());

            Assert.True(staffId1.Equals(staffId2));
            Assert.False(staffId1.Equals(staffId3));
            Assert.False(staffId1.Equals(null));
            Assert.False(staffId1.Equals("Not a StaffId"));
        }

        [Fact]
        public void StaffIdGetHashCodeTest()
        {
            var staffId1 = new StaffId(Guid.NewGuid());
            var staffId2 = new StaffId(staffId1.AsString());
            var staffId3 = new StaffId(Guid.NewGuid());

            Assert.Equal(staffId1.GetHashCode(), staffId2.GetHashCode());
            Assert.NotEqual(staffId1.GetHashCode(), staffId3.GetHashCode());
        }
    }
}
