using System;
using System.Collections.Generic;
using System.Reflection.Metadata;
using DDDSample1.Domain.OperationTypesSpecializations;

namespace DDDSample1.Domain.OperationTypes
{
    public class OperationTypeDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public int EstimatedTimeDuration { get; set; }

        public int AnesthesiaTime { get; set; }

        public int SurgeryTime { get; set; }
        
        public int CleaningTime { get; set; }

        public bool IsActive { get; set; }

        public List<OperationTypeSpecializationDto> Specializations { get; set; }

    }
}