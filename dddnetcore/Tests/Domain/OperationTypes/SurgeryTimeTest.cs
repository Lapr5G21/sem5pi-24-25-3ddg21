using Xunit;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Tests.Domain.OperationTypes
{
    public class SurgeryTimeTest
    {
        [Fact]
        public void ValidSurgeryTimeTest()
        {
            int validMinutes = 30;

            var surgeryTime = new SurgeryTime(validMinutes);

            Assert.Equal(validMinutes, surgeryTime.Minutes);
        }

        [Fact]
        public void SurgeryTimeWithZeroMinutesTest()
        {
            int invalidMinutes = 0;

            Assert.Throws<BusinessRuleValidationException>(() => new SurgeryTime(invalidMinutes));
        }

        [Fact]
        public void SurgeryTimeWithNegativeMinutesTest()
        {
            int invalidMinutes = -5;

            Assert.Throws<BusinessRuleValidationException>(() => new SurgeryTime(invalidMinutes));
        }

        [Fact]
        public void ToStringTest()
        {
            int validMinutes = 45;
            var surgeryTime = new SurgeryTime(validMinutes);
            string expectedString = "45 minutes";

            string result = surgeryTime.ToString();

            Assert.Equal(expectedString, result);
        }

        [Fact]
        public void TestEqualsSameMinutes()
        {
            var surgeryTime1 = new SurgeryTime(30);
            var surgeryTime2 = new SurgeryTime(30);

            Assert.True(surgeryTime1.Equals(surgeryTime2));
        }

        [Fact]
        public void TestEqualsDifferentMinutes()
        {
            var surgeryTime1 = new SurgeryTime(30);
            var surgeryTime2 = new SurgeryTime(45);

            Assert.False(surgeryTime1.Equals(surgeryTime2));
        }

        [Fact]
        public void TestHashCodeSameMinutes()
        {
            var surgeryTime1 = new SurgeryTime(30);
            var surgeryTime2 = new SurgeryTime(30);

            Assert.Equal(surgeryTime1.GetHashCode(), surgeryTime2.GetHashCode());
        }

        [Fact]
        public void TestHashCodeDifferentMinutes()
        {
            var surgeryTime1 = new SurgeryTime(30);
            var surgeryTime2 = new SurgeryTime(45);

            Assert.NotEqual(surgeryTime1.GetHashCode(), surgeryTime2.GetHashCode());
        }
    }
}
