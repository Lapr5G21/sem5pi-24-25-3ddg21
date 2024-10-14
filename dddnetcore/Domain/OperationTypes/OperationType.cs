using System;
using System.Collections.Generic;
using DDDSample1.Domain.OperationTypesSpecializations;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.OperationTypes
{
    public class OperationType : Entity<OperationTypeId>, IAggregateRoot
    {
     
        public OperationTypeName Name { get;  private set; }

        public EstimatedTimeDuration EstimatedTimeDuration {get; private set; }

        public AnesthesiaTime AnesthesiaTime {get; private set; }

        public CleaningTime CleaningTime {get; private set; }

        public SurgeryTime SurgeryTime {get; private set; }

        public bool IsActive{ get;  private set; }

        public List<OperationTypeSpecialization> Specializations { get; private set; } = new List<OperationTypeSpecialization>();


        private OperationType()
        {
            this.IsActive = true;
        }

        public OperationType(OperationTypeName operationTypeName, EstimatedTimeDuration estimatedTimeDuration,AnesthesiaTime anesthesiaTime, CleaningTime cleaningTime, SurgeryTime surgeryTime)
        {
            this.Id = new OperationTypeId(Guid.NewGuid());
            this.Name = operationTypeName;
            this.EstimatedTimeDuration = estimatedTimeDuration;
            this.AnesthesiaTime = anesthesiaTime;
            this.CleaningTime = cleaningTime;
            this.SurgeryTime = surgeryTime;
            this.IsActive = true;
        }

        public void ChangeOperationTypeName(OperationTypeName name)
        {
            if (!this.IsActive)
                throw new BusinessRuleValidationException("It is not possible to change the name to an inactive operation type.");
            this.Name = name;
        }

        public void ChangeOperationTypeDuration(EstimatedTimeDuration estimatedTime)
        {
            if (!this.IsActive)
                throw new BusinessRuleValidationException("It is not possible to change the time to an inactive operation type.");
            this.EstimatedTimeDuration = estimatedTime;
        }

        public void ChangeAnesthesiaTime(AnesthesiaTime anesthesiaTime)
        {
            if (!this.IsActive)
                throw new BusinessRuleValidationException("It is not possible to change the anesthesia time to an inactive operation type.");
            this.AnesthesiaTime = anesthesiaTime;
        }

        public void ChangeSurgeryTime(SurgeryTime surgeryTime)
        {
            if (!this.IsActive)
                throw new BusinessRuleValidationException("It is not possible to change the  surgery time to an inactive operation type.");
            this.SurgeryTime = surgeryTime;
        }

        public void ChangeCleaningTime(CleaningTime cleaningTime)
        {
            if (!this.IsActive)
                throw new BusinessRuleValidationException("It is not possible to change the cleaning time to an inactive operation type.");
            this.CleaningTime = cleaningTime;
        }

        public void MarkAsInative()
        {
            this.IsActive = false;
        }
    }
}