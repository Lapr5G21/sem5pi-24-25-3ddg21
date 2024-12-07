using System;
using Xunit;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.OperationTypesSpecializations;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Specializations;

namespace DDDSample1.Tests.Domain.OperationTypesSpecializations
{
public class OperationTypeSpecializationTests
{
    [Fact]
    public void ValidConstructorTest()
    {
        var operationType = new OperationType(new OperationTypeName("ACL Surgery"), new EstimatedTimeDuration(60), 
            new AnesthesiaTime(30), new CleaningTime(15), new SurgeryTime(45));
        
        var specialization =new Specialization(new SpecializationName("Cardiology"), new SpecializationCode("CD"), new SpecializationDescription(""));

        var numberOfStaff = new NumberOfStaff(5);

        var operationTypeSpecialization = new OperationTypeSpecialization(operationType, specialization, numberOfStaff);

        Assert.NotNull(operationTypeSpecialization);
        Assert.Equal(operationType, operationTypeSpecialization.OperationType);
        Assert.Equal(specialization, operationTypeSpecialization.Specialization);
        Assert.Equal(numberOfStaff, operationTypeSpecialization.NumberOfStaff);
    }

    [Fact]
    public void TestEqualsSameOperationTypes()
    {
        var operationType = new OperationType(new OperationTypeName("Appendectomy"), new EstimatedTimeDuration(60), 
            new AnesthesiaTime(30), new CleaningTime(15), new SurgeryTime(45));
        
        var specialization = new Specialization(new SpecializationName("Cardiology"), new SpecializationCode("CD"), new SpecializationDescription(""));

        var numberOfStaff = new NumberOfStaff(5);
        
        var staffSpecialization1 = new OperationTypeSpecialization(operationType, specialization, numberOfStaff);
        var staffSpecialization2 = new OperationTypeSpecialization(operationType, specialization, numberOfStaff);

        Assert.True(staffSpecialization1.Equals(staffSpecialization2));
        Assert.Equal(staffSpecialization1.GetHashCode(), staffSpecialization2.GetHashCode());
    }

    [Fact]
    public void TestEqualsDifferentOperationTypes()
    {
        var operationType1 = new OperationType(new OperationTypeName("Appendectomy"), new EstimatedTimeDuration(60), 
            new AnesthesiaTime(30), new CleaningTime(15), new SurgeryTime(45));
        
        var operationType2 = new OperationType(new OperationTypeName("ACL Surgery"), new EstimatedTimeDuration(70), 
            new AnesthesiaTime(25), new CleaningTime(20), new SurgeryTime(50));
        
        var specialization = new Specialization(new SpecializationName("Cardiology"), new SpecializationCode("CD"), new SpecializationDescription(""));

        var numberOfStaff = new NumberOfStaff(5);
        
        var staffSpecialization1 = new OperationTypeSpecialization(operationType1, specialization, numberOfStaff);
        var staffSpecialization2 = new OperationTypeSpecialization(operationType2, specialization, numberOfStaff);

        Assert.False(staffSpecialization1.Equals(staffSpecialization2));
    }

    [Fact]
    public void TestGetHashCodeSameOperationTypes()
    {
        var operationType = new OperationType(new OperationTypeName("Appendectomy"), new EstimatedTimeDuration(60), 
            new AnesthesiaTime(30), new CleaningTime(15), new SurgeryTime(45));
        
        var specialization = new Specialization(new SpecializationName("Cardiology"), new SpecializationCode("CD"), new SpecializationDescription(""));

        var numberOfStaff = new NumberOfStaff(5);
        
        var staffSpecialization1 = new OperationTypeSpecialization(operationType, specialization, numberOfStaff);
        var staffSpecialization2 = new OperationTypeSpecialization(operationType, specialization, numberOfStaff);

        Assert.Equal(staffSpecialization1.GetHashCode(), staffSpecialization2.GetHashCode());
    }
}
}
