using Xunit;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Tests.Domain.Patients
{
    public class PatientAddressTests
    {
        [Theory]
        [InlineData("Avenida dos Aliados, Porto")]
        [InlineData("Rua de Santa Catarina, Porto")]
        [InlineData("Rua Mouzinho da Silveira, Lisboa")]
        public void Constructor_ValidAddress_ShouldSetAddressString(string validAddress)
        {
            // Act
            var address = new PatientAddress(validAddress);

            // Assert
            Assert.Equal(validAddress, address.AddressString);
        }

        [Theory]
        [InlineData("")]
        [InlineData("   ")]
        [InlineData(null)]
        public void Constructor_EmptyOrNullAddress_ShouldThrowBusinessRuleValidationException(string invalidAddress)
        {
            // Act & Assert
            Assert.Throws<BusinessRuleValidationException>(() => new PatientAddress(invalidAddress));
        }

        [Fact]
        public void GetHashCode_ShouldReturnHashCodeOfAddressString()
        {
            // Arrange
            string address = "Avenida dos Aliados, Porto";
            var patientAddress = new PatientAddress(address);

            // Act
            int hashCode = patientAddress.GetHashCode();

            // Assert
            Assert.Equal(address.GetHashCode(), hashCode);
        }

        [Fact]
        public void ToString_ShouldReturnAddressString()
        {
            // Arrange
            string address = "Avenida dos Aliados, Porto";
            var patientAddress = new PatientAddress(address);

            // Act
            string result = patientAddress.ToString();

            // Assert
            Assert.Equal(address, result);
        }
    }
}
