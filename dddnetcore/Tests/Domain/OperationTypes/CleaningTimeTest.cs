using Xunit;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Tests.Domain.OperationTypes
{
    public class CleaningTimeTest
    {
        [Fact]
        public void ValidCleaningTimeTest()
        {
            int validMinutes = 30;

            var cleaningTime = new CleaningTime(validMinutes);

            Assert.Equal(validMinutes, cleaningTime.Minutes);
        }

        [Fact]
        public void CleaningTimeWithZeroMinutesTest()
        {
            int invalidMinutes = 0;

            Assert.Throws<BusinessRuleValidationException>(() => new CleaningTime(invalidMinutes));
        }

        [Fact]
        public void CleaningTimeWithNegativeMinutesTest()
        {
            int invalidMinutes = -5;

            Assert.Throws<BusinessRuleValidationException>(() => new CleaningTime(invalidMinutes));
        }

        [Fact]
        public void ToStringTest()
        {
            int validMinutes = 45;
            var cleaningTime = new CleaningTime(validMinutes);
            string expectedString = "45 minutes";

            string result = cleaningTime.ToString();

            Assert.Equal(expectedString, result);
        }

        [Fact]
        public void TestEqualsSameMinutes()
        {
            var cleaningTime1 = new CleaningTime(30);
            var cleaningTime2 = new CleaningTime(30);

            Assert.True(cleaningTime1.Equals(cleaningTime2));
        }

        [Fact]
        public void TestEqualsDifferentMinutes()
        {
            var cleaningTime1 = new CleaningTime(30);
            var cleaningTime2 = new CleaningTime(45);

            Assert.False(cleaningTime1.Equals(cleaningTime2));
        }

        [Fact]
        public void TestHashCodeSameMinutes()
        {
            var cleaningTime1 = new CleaningTime(30);
            var cleaningTime2 = new CleaningTime(30);

            Assert.Equal(cleaningTime1.GetHashCode(), cleaningTime1.GetHashCode());
        }

        [Fact]
        public void TestHashCodeDifferentMinutes()
        {
            var cleaningTime1 = new CleaningTime(30);
            var cleaningTime2 = new CleaningTime(45);

            Assert.NotEqual(cleaningTime1.GetHashCode(), cleaningTime2.GetHashCode());
        }
    }
}
