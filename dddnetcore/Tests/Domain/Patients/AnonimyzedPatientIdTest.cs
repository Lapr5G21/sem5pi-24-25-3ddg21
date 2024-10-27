using System;
using Xunit;
using DDDSample1.Domain.Patients;

namespace DDDSample1.Tests.Domain.Patients
{
    public class AnonimyzedPatientIdTests
    {
        [Fact]
        public void TestConstructorWithValidGuid()
        {
            Guid validGuid = Guid.NewGuid();

            var anonimyzedId = new AnonimyzedPatientId(validGuid);

            Assert.Equal(validGuid, anonimyzedId.AsGuid());
        }


        [Fact]
        public void TestAsString()
        {
            Guid validGuid = Guid.NewGuid();
            var anonimyzedId = new AnonimyzedPatientId(validGuid);

            string result = anonimyzedId.AsString();

            Assert.Equal(validGuid.ToString(), result);
        }

        [Fact]
        public void TestAsGuid()
        {
            string validGuidString = Guid.NewGuid().ToString();
            var anonimyzedId = new AnonimyzedPatientId(validGuidString);

            Guid result = anonimyzedId.AsGuid();

            Assert.Equal(Guid.Parse(validGuidString), result);
        }

        [Fact]
        public void TestCreateFromString()
        {
            string validGuidString = Guid.NewGuid().ToString();
            var anonimyzedId = new AnonimyzedPatientId(validGuidString);

            object createdGuid = anonimyzedId.AsGuid();

            Assert.IsType<Guid>(createdGuid);
            Assert.Equal(Guid.Parse(validGuidString), createdGuid);
        }
    }
}
