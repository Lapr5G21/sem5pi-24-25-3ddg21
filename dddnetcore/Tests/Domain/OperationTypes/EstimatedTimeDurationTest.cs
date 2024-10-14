using Xunit;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Tests.Domain.OperationTypes
{
    public class EstimatedTimeDurationTests
    {
        [Fact]
        public void ValidEstimatedTimeDurationTest()
        {
            int validMinutes = 60;

            var estimatedTime = new EstimatedTimeDuration(validMinutes);

            Assert.Equal(validMinutes, estimatedTime.Minutes);
        }

        [Fact]
        public void EstimatedTimeDurationWithZeroMinutesTest()
        {
            int invalidMinutes = 0;

            Assert.Throws<BusinessRuleValidationException>(() => new EstimatedTimeDuration(invalidMinutes));
        }

        [Fact]
        public void EstimatedTimeDurationWithNegativeMinutesTest()
        {
            int invalidMinutes = -15;

            Assert.Throws<BusinessRuleValidationException>(() => new EstimatedTimeDuration(invalidMinutes));
        }

        [Fact]
        public void ToStringTest()
        {
            int validMinutes = 90;
            var estimatedTime = new EstimatedTimeDuration(validMinutes);
            string expectedString = "90 minutes";

            string result = estimatedTime.ToString();

            Assert.Equal(expectedString, result);
        }

        [Fact]
        public void TestEqualsSameMinutes()
        {
            var estimatedTime1 = new EstimatedTimeDuration(60);
            var estimatedTime2 = new EstimatedTimeDuration(60);

            Assert.True(estimatedTime1.Equals(estimatedTime2));
        }

        [Fact]
        public void TestEqualsDifferentMinutes()
        {
            var estimatedTime1 = new EstimatedTimeDuration(60);
            var estimatedTime2 = new EstimatedTimeDuration(120);

            Assert.False(estimatedTime1.Equals(estimatedTime2));
        }

        [Fact]
        public void TestHashCodeSameMinutes()
        {
            var estimatedTime1 = new EstimatedTimeDuration(60);
            var estimatedTime2 = new EstimatedTimeDuration(60);

            Assert.Equal(estimatedTime1.GetHashCode(), estimatedTime2.GetHashCode());
        }

        [Fact]
        public void TestHashCodeDifferentMinutes()
        {
            var estimatedTime1 = new EstimatedTimeDuration(60);
            var estimatedTime2 = new EstimatedTimeDuration(90);

            Assert.NotEqual(estimatedTime1.GetHashCode(), estimatedTime2.GetHashCode());
        }
    }
}
