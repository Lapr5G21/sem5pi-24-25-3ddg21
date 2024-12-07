using Xunit;
using DDDSample1.Domain.Shared;
using System;
using DDDSample1.Domain.OperationRequests;

namespace DDDSample1.Tests.Domain.OperationRequests
{
    public class DeadLineDateTests
    {
        
        [Fact]
        public void DeadlineDate_FutureDate_Success()
        {
            var futureDate = DateTime.Now.AddDays(1);
            var deadline = new DeadlineDate(futureDate);
            Assert.Equal(futureDate, deadline.Value);
        }

        [Fact]
        public void DeadlineDate_EqualObjects_ReturnsTrue()
        {
            var futureDate = DateTime.Now.AddDays(1);
            var deadline1 = new DeadlineDate(futureDate);
            var deadline2 = new DeadlineDate(futureDate);
            Assert.Equal(deadline1, deadline2);
        }

        [Fact]
        public void DeadlineDate_DifferentObjects_ReturnsFalse()
        {
            var deadline1 = new DeadlineDate(DateTime.Now.AddDays(1));
            var deadline2 = new DeadlineDate(DateTime.Now.AddDays(2));
            Assert.NotEqual(deadline1, deadline2);
        }

        [Fact]
        public void DeadlineDate_HashCode_SameForEqualObjects()
        {
            var futureDate = DateTime.Now.AddDays(1);
            var deadline1 = new DeadlineDate(futureDate);
            var deadline2 = new DeadlineDate(futureDate);
            Assert.Equal(deadline1.GetHashCode(), deadline2.GetHashCode());
        }
        
    }
}
