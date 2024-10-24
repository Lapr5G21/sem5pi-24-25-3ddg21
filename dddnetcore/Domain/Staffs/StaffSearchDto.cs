using System;
using System.ComponentModel.DataAnnotations;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Staffs
{
   public class StaffSearchDto
    {
    public string FullName { get; set; }
    public string PhoneNumber { get; set; }
    public string Email { get; set; }
    public Guid SpecializationId { get; set; }
    public bool? Active { get; set; }
    
    }
}
