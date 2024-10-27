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

<<<<<<< HEAD
            Assert.IsType<Guid>(createdGuid);
            Assert.Equal(Guid.Parse(validGuidString), createdGuid);
=======
            // Assert
            Assert.Equal(guidValue, patientId.AsGuid());
        }


        [Fact]
        public void AsString_ShouldReturn_GuidAsString()
        {
            // Arrange
            Guid guidValue = Guid.NewGuid();
            var patientId = new AnonimyzedPatientId(guidValue);

            // Act
            string result = patientId.AsString();

            // Assert
            Assert.Equal(guidValue.ToString(), result);
        }

        [Fact]
        public void AsGuid_ShouldReturn_GuidValue()
        {
            // Arrange
            Guid guidValue = Guid.NewGuid();
            var patientId = new AnonimyzedPatientId(guidValue);

            // Act
            Guid result = patientId.AsGuid();

            // Assert
            Assert.Equal(guidValue, result);
        }


        [Fact]
        public void CreateFromString_ShouldReturn_Guid_WhenValidString()
        {
            // Arrange
            string validGuid = Guid.NewGuid().ToString();
            var patientId = new TestableAnonimyzedPatientId(Guid.NewGuid()); // Create a valid instance to test the method.

            // Act
            var guid = patientId.TestCreateFromString(validGuid);

            // Assert
            Assert.IsType<Guid>(guid);
            Assert.Equal(new Guid(validGuid), (Guid)guid);
>>>>>>> 3cc4922d05178fabfdd32f3037ed0efbcc05ca24
        }
    }
}
