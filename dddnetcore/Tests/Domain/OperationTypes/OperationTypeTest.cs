using System;
using Xunit;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.OperationTypesSpecializations;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Tests.Domain.OperationTypes
{
    public class OperationTypeTests
    {
        [Fact]
        public void CreateValidOperationTypeTest()
        {
            var operationTypeName = new OperationTypeName("Cardiology");
            var estimatedTime = new EstimatedTimeDuration(120);
            var anesthesiaTime = new AnesthesiaTime(30);
            var cleaningTime = new CleaningTime(15);
            var surgeryTime = new SurgeryTime(90);

            var operationType = new OperationType(operationTypeName, estimatedTime, anesthesiaTime, cleaningTime, surgeryTime);

            Assert.Equal(operationTypeName, operationType.Name);
            Assert.Equal(estimatedTime, operationType.EstimatedTimeDuration);
            Assert.Equal(anesthesiaTime, operationType.AnesthesiaTime);
            Assert.Equal(cleaningTime, operationType.CleaningTime);
            Assert.Equal(surgeryTime, operationType.SurgeryTime);
            Assert.True(operationType.IsActive);
        }

        [Fact]
        public void ChangeOperationTypeNameTest()
        {
            var operationTypeName = new OperationTypeName("Cardiology");
            var estimatedTime = new EstimatedTimeDuration(120);
            var anesthesiaTime = new AnesthesiaTime(30);
            var cleaningTime = new CleaningTime(15);
            var surgeryTime = new SurgeryTime(90);
            var operationType = new OperationType(operationTypeName, estimatedTime, anesthesiaTime, cleaningTime, surgeryTime);

            var newOperationTypeName = new OperationTypeName("Neurology");

            operationType.ChangeOperationTypeName(newOperationTypeName);

            Assert.Equal(newOperationTypeName, operationType.Name);
        }

        [Fact]
        public void ChangeOperationTypeDurationTest()
        {
            var operationTypeName = new OperationTypeName("Cardiology");
            var estimatedTime = new EstimatedTimeDuration(120);
            var anesthesiaTime = new AnesthesiaTime(30);
            var cleaningTime = new CleaningTime(15);
            var surgeryTime = new SurgeryTime(90);
            var operationType = new OperationType(operationTypeName, estimatedTime, anesthesiaTime, cleaningTime, surgeryTime);

            var newEstimatedTime = new EstimatedTimeDuration(150);

            operationType.ChangeOperationTypeDuration(newEstimatedTime);

            Assert.Equal(newEstimatedTime, operationType.EstimatedTimeDuration);
        }

        [Fact]
        public void ChangeAnesthesiaTimeTest()
        {
            var operationTypeName = new OperationTypeName("Cardiology");
            var estimatedTime = new EstimatedTimeDuration(120);
            var anesthesiaTime = new AnesthesiaTime(30);
            var cleaningTime = new CleaningTime(15);
            var surgeryTime = new SurgeryTime(90);
            var operationType = new OperationType(operationTypeName, estimatedTime, anesthesiaTime, cleaningTime, surgeryTime);

            var newAnesthesiaTime = new AnesthesiaTime(40);

            operationType.ChangeAnesthesiaTime(newAnesthesiaTime);

            Assert.Equal(newAnesthesiaTime, operationType.AnesthesiaTime);
        }

        [Fact]
        public void ChangeSurgeryTimeTest()
        {
            var operationTypeName = new OperationTypeName("Cardiology");
            var estimatedTime = new EstimatedTimeDuration(120);
            var anesthesiaTime = new AnesthesiaTime(30);
            var cleaningTime = new CleaningTime(15);
            var surgeryTime = new SurgeryTime(90);
            var operationType = new OperationType(operationTypeName, estimatedTime, anesthesiaTime, cleaningTime, surgeryTime);

            var newSurgeryTime = new SurgeryTime(120);

            operationType.ChangeSurgeryTime(newSurgeryTime);

            Assert.Equal(newSurgeryTime, operationType.SurgeryTime);
        }

        [Fact]
        public void ChangeCleaningTimeTest()
        {
            var operationTypeName = new OperationTypeName("Cardiology");
            var estimatedTime = new EstimatedTimeDuration(120);
            var anesthesiaTime = new AnesthesiaTime(30);
            var cleaningTime = new CleaningTime(15);
            var surgeryTime = new SurgeryTime(90);
            var operationType = new OperationType(operationTypeName, estimatedTime, anesthesiaTime, cleaningTime, surgeryTime);

            var newCleaningTime = new CleaningTime(20);

            
            operationType.ChangeCleaningTime(newCleaningTime);

            Assert.Equal(newCleaningTime, operationType.CleaningTime);
        }

        [Fact]
        public void MarkAsInactiveTest()
        {
            var operationTypeName = new OperationTypeName("Cardiology");
            var estimatedTime = new EstimatedTimeDuration(120);
            var anesthesiaTime = new AnesthesiaTime(30);
            var cleaningTime = new CleaningTime(15);
            var surgeryTime = new SurgeryTime(90);
            var operationType = new OperationType(operationTypeName, estimatedTime, anesthesiaTime, cleaningTime, surgeryTime);

            operationType.MarkAsInative();

            Assert.False(operationType.IsActive);
        }

        [Fact]
        public void ChangeOperationTypeNameInactiveTest()
        {
            var operationTypeName = new OperationTypeName("Cardiology");
            var estimatedTime = new EstimatedTimeDuration(120);
            var anesthesiaTime = new AnesthesiaTime(30);
            var cleaningTime = new CleaningTime(15);
            var surgeryTime = new SurgeryTime(90);
            var operationType = new OperationType(operationTypeName, estimatedTime, anesthesiaTime, cleaningTime, surgeryTime);
            operationType.MarkAsInative();

            var newOperationTypeName = new OperationTypeName("Neurology");

            Assert.Throws<BusinessRuleValidationException>(() => operationType.ChangeOperationTypeName(newOperationTypeName));
        }
    }
}
