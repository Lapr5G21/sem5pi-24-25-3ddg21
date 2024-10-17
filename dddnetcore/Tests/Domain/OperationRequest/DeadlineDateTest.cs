using Xunit;
using DDDSample1.Domain.OperationRequest;
using DDDSample1.Domain.Shared;
using System;

namespace DDDSample1.Tests.Domain.OperationRequest
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
        public void DeadlineDate_PastDate_ThrowsException()
        {
            var pastDate = DateTime.Now.AddDays(-1);
            Assert.Throws<BusinessRuleValidationException>(() => new DeadlineDate(pastDate));
        }

        [Fact]
        public void DeadlineDate_PresentDate_ThrowsException()
        {
            var now = DateTime.Now;
            Assert.Throws<BusinessRuleValidationException>(() => new DeadlineDate(now));
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

        [Fact]
        public void DeadlineDate_ToString_CorrectFormat()
        {
            var futureDate = new DateTime(2024, 10, 10);
            var deadline = new DeadlineDate(futureDate);
            Assert.Equal("10/10/2024 00:00:00 -> DeadlineDate", deadline.ToString());
        }
    }
}
