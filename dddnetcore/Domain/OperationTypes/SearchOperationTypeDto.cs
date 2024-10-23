using System;
using System.Collections.Generic;
using System.Reflection.Metadata;
using DDDSample1.Domain.OperationTypesSpecializations;

namespace DDDSample1.Domain.OperationTypes
{
    public class SearchOperationTypeDto
    {
    public string Name { get; set; }
    public Guid SpecializationId { get; set; }
    public bool? IsActive { get; set; }
    }
}