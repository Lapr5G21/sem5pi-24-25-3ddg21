using System;
using System.Collections.Generic;
using DDDSample1.Domain.OperationTypesSpecializations;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Specializations
{
    public class Specialization : Entity<SpecializationId>, IAggregateRoot
    {
     
        public SpecializationName SpecializationName{ get;  private set; }
        public SpecializationCode SpecializationCode{get; private set;}
        public SpecializationDescription SpecializationDescription{get; private set;}

        public List<OperationTypeSpecialization> OperationTypes { get; private set; } = new List<OperationTypeSpecialization>();

        private Specialization()
        {
        }

        public Specialization(SpecializationName specializationName,SpecializationCode specializationCode,SpecializationDescription specializationDescription)
        {
            this.Id = new SpecializationId(Guid.NewGuid());
            this.SpecializationName = specializationName;
            this.SpecializationCode=specializationCode;
            this.SpecializationDescription=specializationDescription;
        }

        

        public void ChangeSpecializationName(SpecializationName name)
        {
            this.SpecializationName = name;
        }

        public void ChangeSpecializationCode(SpecializationCode code)
        {
            this.SpecializationCode = code;
        }

        public void UpdateSpecializationDescription(SpecializationDescription specializationDescription){
            this.SpecializationDescription=specializationDescription;
        }
    }
}