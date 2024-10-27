using System;
using Xunit;
using DDDSample1.Domain.Patients;

namespace DDDSample1.Domain.Tests
{
    public class AnonimyzedPatientIdTests
    {
        // Subclass to access the protected method
        private class TestableAnonimyzedPatientId : AnonimyzedPatientId
        {
            public TestableAnonimyzedPatientId(Guid value) : base(value) { }
            public TestableAnonimyzedPatientId(string value) : base(value) { }

            public object TestCreateFromString(string text)
            {
                return createFromString(text);
            }
        }

        [Fact]
        public void Constructor_ShouldAccept_ValidGuid()
        {
            // Arrange
            Guid guidValue = Guid.NewGuid();

            // Act
            var patientId = new AnonimyzedPatientId(guidValue);

            // Assert
            Assert.Equal(guidValue, patientId.AsGuid());
        }

        [Fact]
        public void Constructor_ShouldAccept_ValidString()
        {
            // Arrange
            Guid guidValue = Guid.NewGuid();
            string guidString = guidValue.ToString();

            // Act
            var patientId = new AnonimyzedPatientId(guidString);

            // Assert
            Assert.Equal(guidValue, patientId.AsGuid());
        }

        [Fact]
        public void Constructor_ShouldThrowException_WhenInvalidGuidString()
        {
            // Arrange
            string invalidGuid = "invalid-guid";

            // Act & Assert
            var exception = Assert.Throws<FormatException>(() => new AnonimyzedPatientId(invalidGuid));
            Assert.Equal("Invalid GUID format.", exception.Message);
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
        public void CreateFromString_ShouldThrowException_WhenInvalidString()
        {
            // Arrange
            string invalidGuid = "not-a-guid";
            var patientId = new TestableAnonimyzedPatientId(Guid.NewGuid()); // Create a valid instance to test the method.

            // Act & Assert
            var exception = Assert.Throws<FormatException>(() => 
                patientId.TestCreateFromString(invalidGuid));
            Assert.Equal("Invalid GUID format.", exception.Message);
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
        }
    }
}
