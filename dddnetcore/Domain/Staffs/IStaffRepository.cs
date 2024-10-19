using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Specializations;


namespace DDDSample1.Domain.Staffs
{
    public interface IStaffRepository : IRepository<Staff, StaffId>
    {
        Task<Staff> FindByLicenseNumberAsync(StaffLicenseNumber staffLicenseNumber);
        Task<Staff> FindBySpecializationAsync(SpecializationId specializationId);
        Task<Staff> FindByNameAsync(StaffFullName staffFullName);
        Task<Staff> FindByPhoneNumberAsync(StaffPhoneNumber staffPhoneNumber);
    }
}