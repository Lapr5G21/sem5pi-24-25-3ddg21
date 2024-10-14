using System;
using System.Collections.Generic;
using DDDSample1.Domain.OperationTypesSpecializations;

namespace DDDSample1.Domain.Specializations
{
    public class SpecializationDto
    {
        public Guid Id { get; set; }

        public string SpecializationName { get; set; }
    }
}