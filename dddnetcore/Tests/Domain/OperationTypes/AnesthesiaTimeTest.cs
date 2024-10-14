using Xunit;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Tests.Domain.OperationTypes
{
    public class AnesthesiaTimeTests
    {
        [Fact]
        public void ValidAnesthesiaTimeTest()
        {
            int validMinutes = 30;

            var anesthesiaTime = new AnesthesiaTime(validMinutes);

            Assert.Equal(validMinutes, anesthesiaTime.Minutes);
        }

        [Fact]
        public void AnesthesiaTimeWithZeroMinutesTest()
        {
            int invalidMinutes = 0;

            Assert.Throws<BusinessRuleValidationException>(() => new AnesthesiaTime(invalidMinutes));
        }

        [Fact]
        public void AnesthesiaTimeWithNegativeMinutesTest()
        {
            int invalidMinutes = -5;

            Assert.Throws<BusinessRuleValidationException>(() => new AnesthesiaTime(invalidMinutes));
        }

        [Fact]
        public void ToStringTest()
        {
            int validMinutes = 45;
            var anesthesiaTime = new AnesthesiaTime(validMinutes);
            string expectedString = "45 minutes";

            string result = anesthesiaTime.ToString();

            Assert.Equal(expectedString, result);
        }

        [Fact]
        public void TestEqualsSameMinutes()
        {
            var anesthesiaTime1 = new AnesthesiaTime(30);
            var anesthesiaTime2 = new AnesthesiaTime(30);

            Assert.True(anesthesiaTime1.Equals(anesthesiaTime2));
        }

        [Fact]
        public void TestEqualsDifferentMinutes()
        {
            var anesthesiaTime1 = new AnesthesiaTime(30);
            var anesthesiaTime2 = new AnesthesiaTime(45);

            Assert.False(anesthesiaTime1.Equals(anesthesiaTime2));
        }

        [Fact]
        public void TestHashCodeSameMinutes()
        {
            var anesthesiaTime1 = new AnesthesiaTime(30);
            var anesthesiaTime2 = new AnesthesiaTime(30);

            Assert.Equal(anesthesiaTime1.GetHashCode(), anesthesiaTime2.GetHashCode());
        }

        [Fact]
        public void TestHashCodeDifferentMinutes()
        {
            var anesthesiaTime1 = new AnesthesiaTime(30);
            var anesthesiaTime2 = new AnesthesiaTime(45);

            Assert.NotEqual(anesthesiaTime1.GetHashCode(), anesthesiaTime2.GetHashCode());
        }
    }
}
