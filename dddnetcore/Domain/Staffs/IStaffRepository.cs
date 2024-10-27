using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;


namespace DDDSample1.Domain.Staffs
{
    public interface IStaffRepository : IRepository<Staff, StaffId>
    {
    public Task<IEnumerable<Staff>> SearchAsync(StaffSearchDto searchDto);

    }

}