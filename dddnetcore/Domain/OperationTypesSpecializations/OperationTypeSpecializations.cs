using System;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.OperationTypesSpecializations;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Specializations;

namespace DDDSample1.Domain.OperationTypesSpecializations
{
    public class OperationTypeSpecialization : Entity<OperationTypeSpecializationId>, IAggregateRoot
    {
        public NumberOfStaff NumberOfStaff { get; private set; }
        public OperationType OperationType { get; private set; }
        public Specialization Specialization { get; private set; }
        private OperationTypeSpecialization() { }

        public OperationTypeSpecialization(OperationType operationType, Specialization specialization, NumberOfStaff numberOfStaff)
        {
            this.Id = new OperationTypeSpecializationId(operationType.Id, specialization.Id);
            this.OperationType = operationType;
            this.Specialization = specialization;
            this.NumberOfStaff = numberOfStaff;
        }

        public override bool Equals(object obj)
        {
            if (obj == null || GetType() != obj.GetType())
                return false;

            var other = (OperationTypeSpecialization)obj;
            return Id.Equals(other.Id);
        }

        public override int GetHashCode()
        {
            return Id.GetHashCode();
        }

        public void ChangeNumberOfStaff(NumberOfStaff numberOfStaff){
            this.NumberOfStaff=numberOfStaff;
        }
    }
}   