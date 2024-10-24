using System;
using System.Collections.Generic;
using DDDSample1.Domain.OperationTypesSpecializations;

namespace DDDSample1.Domain.OperationTypes
{
    public class EditOperationTypeDto
    {
        public string OperationTypeId { get; set; }
        public string Name { get; set; }

        public int EstimatedTimeDuration { get; set; }
        
        public List<OperationTypeSpecialization> Specializations { get; set; }
    }
}