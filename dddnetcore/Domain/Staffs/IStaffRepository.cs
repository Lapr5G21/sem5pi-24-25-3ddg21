using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Specializations;


namespace DDDSample1.Domain.Staffs
{
    public interface IStaffRepository : IRepository<Staff, StaffId>
    {
    public Task<IEnumerable<Staff>> SearchAsync(StaffSearchDto searchDto);
    public Task<IEnumerable<Staff>> CheckSpecializationIsAtributtedToStaff(Specialization specialization);
    Task<bool> IsAvailableInSlotsAsync(StaffId staffId, DateTime startTime, DateTime endTime);

    }

}