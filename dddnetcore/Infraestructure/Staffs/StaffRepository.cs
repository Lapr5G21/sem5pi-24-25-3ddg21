using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.Specializations;
using DDDSample1.Domain.Staffs;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace DDDSample1.Infrastructure.Staffs
{
    public class StaffRepository : BaseRepository<Staff, StaffId>, IStaffRepository
    {
        private readonly DDDSample1DbContext _context;

        public StaffRepository(DDDSample1DbContext context) : base(context.Staffs)
        {
            _context = context;
        }

        public async Task<IEnumerable<Staff>> CheckSpecializationIsAtributtedToStaff(Specialization specialization)
        {
            return await _context.Staffs.Where(s => s.SpecializationId == specialization.Id).ToListAsync();

        }

        public async Task<IEnumerable<Staff>> SearchAsync(StaffSearchDto searchDto)
        {
        var staffs = await _context.Staffs.AsNoTracking().ToListAsync();

        if (!string.IsNullOrEmpty(searchDto.FullName))
        {
            staffs = staffs
                .Where(s => s.StaffFullName.FullNameString.Contains(searchDto.FullName, StringComparison.OrdinalIgnoreCase))
                .ToList();
        }

        if (searchDto.SpecializationId != null)
        {
            staffs = staffs
                .Where(s =>  s.SpecializationId.Value == searchDto.SpecializationId)
                .ToList();
        }

        if (searchDto.Active != null)
        {
            staffs = staffs
                .Where(s => s.Active == searchDto.Active)
                .ToList();
        }

        if (!string.IsNullOrEmpty(searchDto.PhoneNumber))
        {
            staffs = staffs
                .Where(s => s.StaffPhoneNumber.PhoneNumberString.Contains(searchDto.PhoneNumber))
                .ToList();
        }

        if (!string.IsNullOrEmpty(searchDto.Email))
        {
            staffs = staffs
                .Where(s => s.StaffEmail.EmailString.Contains(searchDto.Email))
                .ToList();
        }

        return staffs;
    }

    }
}
