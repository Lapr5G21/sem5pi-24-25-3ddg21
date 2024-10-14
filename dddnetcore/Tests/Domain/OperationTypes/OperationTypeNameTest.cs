using Xunit;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Tests.Domain.OperationTypes
{
    public class OperationTypeNameTests
    {
        [Fact]
        public void ValidOperationTypeNameTest()
        {
            string validName = "ACL Surgery";

            var operationTypeName = new OperationTypeName(validName);

            Assert.Equal(validName, operationTypeName.Name);
        }

        [Fact]
        public void OperationTypeNameWithEmptyStringTest()
        {
            string invalidName = "";

            Assert.Throws<BusinessRuleValidationException>(() => new OperationTypeName(invalidName));
        }

        [Fact]
        public void OperationTypeNameWithNullStringTest()
        {
            string invalidName = null;

            Assert.Throws<BusinessRuleValidationException>(() => new OperationTypeName(invalidName));
        }

        [Fact]
        public void ToStringTest()
        {
            string validName = "ACL Surgery";
            var operationTypeName = new OperationTypeName(validName);
            string expectedString = "ACL Surgery";

            // Act
            string result = operationTypeName.ToString();

            // Assert
            Assert.Equal(expectedString, result);
        }

        [Fact]
        public void TestEqualsSameName()
        {
            // Arrange
            var operationTypeName1 = new OperationTypeName("ACL Surgery");
            var operationTypeName2 = new OperationTypeName("ACL Surgery");

            // Act & Assert
            Assert.True(operationTypeName1.Equals(operationTypeName2));
        }

        [Fact]
        public void TestEqualsDifferentName()
        {
            // Arrange
            var operationTypeName1 = new OperationTypeName("ACL Surgery");
            var operationTypeName2 = new OperationTypeName("Cardiology");

            // Act & Assert
            Assert.False(operationTypeName1.Equals(operationTypeName2));
        }

        [Fact]
        public void TestHashCodeSameName()
        {
            // Arrange
            var operationTypeName1 = new OperationTypeName("ACL Surgery");
            var operationTypeName2 = new OperationTypeName("ACL Surgery");

            // Act & Assert
            Assert.Equal(operationTypeName1.GetHashCode(), operationTypeName2.GetHashCode());
        }

        [Fact]
        public void TestHashCodeDifferentName()
        {
            // Arrange
            var operationTypeName1 = new OperationTypeName("ACL Surgery");
            var operationTypeName2 = new OperationTypeName("Cardiology");

            // Act & Assert
            Assert.NotEqual(operationTypeName1.GetHashCode(), operationTypeName2.GetHashCode());
        }
    }
}
