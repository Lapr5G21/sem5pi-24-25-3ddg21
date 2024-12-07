using System.Collections.Generic;
using DDDSample1.Domain.OperationTypesSpecializations;

namespace DDDSample1.Domain.Specializations
{
    public class CreatingSpecializationDto
    {
        public string SpecializationName { get; set; }
        public string SpecializationCode { get; set; }
        public string SpecializationDescription { get; set; }

        public CreatingSpecializationDto(string specializationName, string specializationCode, string specializationDescription)
        {
            this.SpecializationName = specializationName;
            this.SpecializationCode=specializationCode;
            this.SpecializationDescription=specializationDescription;
        }
    }
}