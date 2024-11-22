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
        public int AnesthesiaTime { get; set; }
        public int SurgeryTime { get; set; }
        public int CleaningTime { get; set; }
        public List<CreatingOperationTypeSpecializationDto> Specializations { get; set; }
    }
}