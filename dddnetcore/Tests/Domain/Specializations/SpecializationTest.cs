using System;
using Xunit;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Specializations;
using DDDSample1.Domain.OperationTypesSpecializations;

namespace DDDSample1.Tests.Domain.Specializations
{
    public class SpecializationTests
    {
        [Fact]
        public void ValidConstructorTest()
        {
            var validName = new SpecializationName("Cardiology");
            var validCode = new SpecializationCode("CD");
            var validDesc = new SpecializationDescription("");
            var specialization = new Specialization(validName,validCode,validDesc);

            Assert.Equal(validName, specialization.SpecializationName);
        }

        [Fact]
        public void ChangeSpecializationNameTest()
        {
            var initialName = new SpecializationName("Cardiology");
            var validCode = new SpecializationCode("CD");
            var validDesc = new SpecializationDescription("");
            var specialization = new Specialization(initialName,validCode,validDesc);
            var newName = new SpecializationName("Neurology");

            specialization.ChangeSpecializationName(newName);

            Assert.Equal(newName, specialization.SpecializationName);
        }
    }
}
