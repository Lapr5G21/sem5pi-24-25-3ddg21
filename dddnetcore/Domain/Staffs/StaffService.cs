using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Threading.Tasks;
using DDDSample1.Domain;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Staffs;
using DDDSample1.Domain.Users;
using DDDSample1.Domain.Specializations;
using Microsoft.Extensions.Configuration;
using System.Linq;

namespace DDDSample1.Domain.Staffs
{
    public class StaffService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IStaffRepository _staffRepository;
        private readonly IConfiguration _configuration;
        private readonly ISpecializationRepository _specializationRepository;
        private readonly IUserRepository _userRepository;



        public StaffService(IUnitOfWork unitOfWork, IStaffRepository staffRepository, IConfiguration configuration, ISpecializationRepository specializationRepository, IUserRepository userRepository)
        {
            _unitOfWork = unitOfWork;
            _staffRepository = staffRepository;
            _configuration = configuration;
            _specializationRepository = specializationRepository;
            _userRepository = userRepository;
        }

        public async Task<List<StaffDto>> GetAllAsync()
        {
            var list = await this._staffRepository.GetAllAsync();
            List<StaffDto> listDto = list.ConvertAll(staff => new StaffDto
            {
                StaffId = staff.Id.AsString(),
                StaffFirstName = staff.StaffFirstName.ToString(),
                StaffLastName = staff.StaffLastName.ToString(),
                StaffFullName = staff.StaffFullName.ToString(),
                StaffLicenseNumber = staff.StaffLicenseNumber.ToString(),
                SpecializationId = staff.SpecializationId.AsString(),
                StaffEmail = staff.StaffEmail.ToString(),
                StaffPhoneNumber = staff.StaffPhoneNumber.ToString(),
                StaffAvailabilitySlots = staff.StaffAvailabilitySlots.ToString(),
                UserId = staff.UserId.ToString()
            });
            return listDto;
        }

        public async Task<StaffDto> GetByIdAsync(StaffId staffId)
        {
            var staff = await this._staffRepository.GetByIdAsync(staffId);
            if (staff == null) return null;

            return new StaffDto
            {
                StaffId = staff.Id.AsString(),
                StaffFirstName = staff.StaffFirstName.ToString(),
                StaffLastName = staff.StaffLastName.ToString(),
                StaffFullName = staff.StaffFullName.ToString(),
                StaffLicenseNumber = staff.StaffLicenseNumber.ToString(),
                SpecializationId = staff.SpecializationId.AsString(),
                StaffEmail = staff.StaffEmail.ToString(),
                StaffPhoneNumber = staff.StaffPhoneNumber.ToString(),
                StaffAvailabilitySlots = staff.StaffAvailabilitySlots.ToString(),
                UserId = staff.UserId.ToString()
            };
        }
        public async Task<StaffDto> AddAsync(CreatingStaffDto dto)
        {
            var user = await _userRepository.GetByIdAsync(new Username(dto.UserId));
            if (user == null)
                throw new InvalidOperationException("User not found.");

            RoleType roleType = user.Role.RoleValue;
            
            var staffId = new StaffId(user.Id.ToString().Split('@')[0]);

            var specialization = await _specializationRepository.GetByIdAsync(new SpecializationId(dto.SpecializationId));
            if (specialization == null)
                throw new InvalidOperationException("Specialization not found.");

            var availabilitySlots = dto.StaffAvailabilitySlots;

            var staff = new Staff(
                staffId, 
                new StaffFirstName(dto.FirstName), 
                new StaffLastName(dto.LastName), 
                new StaffFullName(dto.FullName),
                new StaffLicenseNumber(dto.LicenseNumber), 
                specialization.Id, 
                new StaffEmail(dto.Email), 
                new StaffPhoneNumber(dto.PhoneNumber), 
                user.Id,
                new StaffAvailabilitySlots(availabilitySlots)
            );

            await this._staffRepository.AddAsync(staff);
            await this._unitOfWork.CommitAsync();

            return new StaffDto
            {
                StaffId = staff.Id.AsString(),
                StaffFirstName = staff.StaffFirstName.ToString(),
                StaffLastName = staff.StaffLastName.ToString(),
                StaffFullName = staff.StaffFullName.ToString(),
                StaffLicenseNumber = staff.StaffLicenseNumber.ToString(),
                SpecializationId = specialization.Id.AsString(),
                StaffEmail = staff.StaffEmail.ToString(),
                StaffPhoneNumber = staff.StaffPhoneNumber.ToString(),
                StaffAvailabilitySlots = staff.StaffAvailabilitySlots.ToString(),
                UserId = staff.UserId.ToString()
            };
        }

        public async Task<StaffDto> UpdateAsync(EditingStaffDto dto)
        {
            var staff = await this._staffRepository.GetByIdAsync(new StaffId(dto.StaffId));
            if (staff == null) 
            {
                throw new ArgumentException("Staff not found.");
            }

            staff.ChangeFirstName(new StaffFirstName(dto.FirstName));
            staff.ChangeLastName(new StaffLastName(dto.LastName));
            staff.ChangeFullName(new StaffFullName(dto.FullName));
            staff.ChangeEmail(new StaffEmail(dto.Email));
            staff.ChangePhoneNumber(new StaffPhoneNumber(dto.PhoneNumber));
            staff.ChangeSpecialization(new SpecializationId(dto.SpecializationId));

            await this._unitOfWork.CommitAsync();

            return new StaffDto
            {
                StaffId = staff.Id.ToString(),
                StaffFirstName = staff.StaffFirstName.ToString(),
                StaffLastName = staff.StaffLastName.ToString(),
                StaffFullName = staff.StaffFullName.ToString(),
                StaffLicenseNumber = staff.StaffLicenseNumber.ToString(),
                SpecializationId = staff.SpecializationId.ToString(),
                StaffEmail = staff.StaffEmail.ToString(),
                StaffPhoneNumber = staff.StaffPhoneNumber.ToString(),
                StaffAvailabilitySlots = staff.StaffAvailabilitySlots.ToString(),
                UserId = staff.UserId.ToString()
            };
        }

        public async Task<StaffDto> DeleteAsync(StaffId staffId)
        {
            var staff = await this._staffRepository.GetByIdAsync(staffId);
            if (staff == null) return null;

            this._staffRepository.Remove(staff);
            await this._unitOfWork.CommitAsync();

            return new StaffDto
            {
                StaffId = staff.Id.ToString(),
                StaffFirstName = staff.StaffFirstName.ToString(),
                StaffLastName = staff.StaffLastName.ToString(),
                StaffFullName = staff.StaffFullName.ToString(),
                StaffLicenseNumber = staff.StaffLicenseNumber.ToString(),
                SpecializationId = staff.SpecializationId.ToString(),
                StaffEmail = staff.StaffEmail.ToString(),
                StaffPhoneNumber = staff.StaffPhoneNumber.ToString(),
                StaffAvailabilitySlots = staff.StaffAvailabilitySlots.ToString(),
                UserId = staff.UserId.ToString()
            };
        }

       public async Task<IEnumerable<StaffDto>> SearchStaffAsync(StaffSearchDto searchDto)
        {
            var staffs = await _staffRepository.GetAllAsync();

            IEnumerable<Staff> filteredStaffs = staffs.AsEnumerable();

            if (!string.IsNullOrEmpty(searchDto.FullName))
            {
                filteredStaffs = filteredStaffs.Where(s => s.StaffFullName.ToString().Contains(searchDto.FullName, StringComparison.OrdinalIgnoreCase));
            }

            if (searchDto.SpecializationId != Guid.Empty)
            {
                filteredStaffs = filteredStaffs.Where(s => s.SpecializationId.Equals(searchDto.SpecializationId));
            }
            
            if (!string.IsNullOrEmpty(searchDto.PhoneNumber))
            {
                filteredStaffs = filteredStaffs.Where(s => s.StaffPhoneNumber.ToString().Contains(searchDto.PhoneNumber));
            }
            
            if (!string.IsNullOrEmpty(searchDto.Email))
            {
                filteredStaffs = filteredStaffs.Where(s => s.StaffEmail.ToString().Contains(searchDto.Email));
            }

            if (searchDto.Active != null)
            {
                filteredStaffs = filteredStaffs.Where(s => s.Active == searchDto.Active);
            }

            return filteredStaffs.Select(s => new StaffDto
            {
                StaffId = s.Id.ToString(),
                StaffFirstName = s.StaffFirstName.ToString(),
                StaffLastName = s.StaffLastName.ToString(),
                StaffFullName = s.StaffFullName.ToString(),
                StaffLicenseNumber = s.StaffLicenseNumber.ToString(),
                SpecializationId = s.SpecializationId.ToString(),
                StaffEmail = s.StaffEmail.ToString(),
                StaffPhoneNumber = s.StaffPhoneNumber.ToString(),
                StaffAvailabilitySlots = s.StaffAvailabilitySlots.ToString(),
            }).ToList();
        }
    }
}
