using System;
using Xunit;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Specializations;

namespace DDDSample1.Tests.Domain.Specializations
{
    public class SpecializationNameTests
    {
        [Fact]
        public void ValidConstructorTest()
        {
            
            var validName = "Cardiology";

            var specializationName = new SpecializationName(validName);

            Assert.Equal(validName, specializationName.Name);
        }

        [Fact]
        public void InvalidConstructorEmptyNameTest()
        {
            var invalidName = "";

            var exception = Assert.Throws<BusinessRuleValidationException>(() => new SpecializationName(invalidName));
            Assert.Equal("Specialization name cannot be empty or null.", exception.Message);
        }

        [Fact]
        public void InvalidConstructorNullNameTest()
        {
            string invalidName = null;

            var exception = Assert.Throws<BusinessRuleValidationException>(() => new SpecializationName(invalidName));
            Assert.Equal("Specialization name cannot be empty or null.", exception.Message);
        }

        [Fact]
        public void TestEqualsSameName()
        {
            var name1 = new SpecializationName("Cardiology");
            var name2 = new SpecializationName("Cardiology");

            var result = name1.Equals(name2);

           Assert.True(result);
        }

        [Fact]
        public void TestEqualsDifferentName()
        {
            
            var name1 = new SpecializationName("Cardiology");
            var name2 = new SpecializationName("Neurology");

            var result = name1.Equals(name2);

            Assert.False(result);
        }

        [Fact]
        public void TestHashCodeSameName()
        {
            var name1 = new SpecializationName("Cardiology");
            var name2 = new SpecializationName("Cardiology");

            var hashCode1 = name1.GetHashCode();
            var hashCode2 = name2.GetHashCode();

            Assert.Equal(hashCode1, hashCode2);
        }

        [Fact]
        public void TestHashCodeDifferentName()
        {
            var name1 = new SpecializationName("Cardiology");
            var name2 = new SpecializationName("Radiology");

            var hashCode1 = name1.GetHashCode();
            var hashCode2 = name2.GetHashCode();

            Assert.NotEqual(hashCode1, hashCode2);
        }


        [Fact]
        public void TestToString()
        {
            var specializationName = new SpecializationName("Cardiology");

            var result = specializationName.ToString();

            Assert.Equal("Cardiology", result);
        }
    }
}
