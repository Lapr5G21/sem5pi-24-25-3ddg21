using System.Collections.Generic;
using DDDSample1.Domain.OperationTypesSpecializations;

namespace DDDSample1.Domain.Specializations
{
    public class CreatingSpecializationDto
    {
        public string SpecializationName { get; set; }
        public CreatingSpecializationDto(string specializationName)
        {
            this.SpecializationName = specializationName;
        }
    }
}