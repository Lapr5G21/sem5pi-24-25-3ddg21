using System.Threading.Tasks;
using DDDSample1.Domain.Staffs;
using DDDSample1.Infrastructure.Shared;

namespace DDDSample1.Infrastructure.Staffs
{
    public class StaffRepository : BaseRepository<Staff, StaffId>, IStaffRepository
    {
        private readonly DDDSample1DbContext _context;

        public StaffRepository(DDDSample1DbContext context) : base(context.Staffs)
        {
            _context = context;
        }


        public Task<Staff> FindByLicenseNumberAsync(LicenseNumber licenseNumber)
        {
            throw new System.NotImplementedException();
        }

    }
}
