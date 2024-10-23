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
                new StaffAvailabilitySlots()
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


        public async Task<StaffDto> UpdateAsync(StaffDto dto)
        {
            var staff = await this._staffRepository.GetByIdAsync(new StaffId(dto.StaffId));
            if (staff == null) return null;

            staff.ChangeFirstName(new StaffFirstName(dto.StaffFirstName));
            staff.ChangeLastName(new StaffLastName(dto.StaffLastName));
            staff.ChangeFullName(new StaffFullName(dto.StaffFullName));
            staff.ChangeEmail(new StaffEmail(dto.StaffEmail));
            staff.ChangePhoneNumber(new StaffPhoneNumber(dto.StaffPhoneNumber));

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

        // Gera um novo ID de funcionário no formato "(N | D | O)aaaannnn"/* 
      /*  public StaffId GenerateStaffId(RoleType roleType)
        {
            string prefix;

            switch (roleType)
            {
                case RoleType.Doctor:
                    prefix = "D";
                    break;
                case RoleType.Nurse:
                    prefix = "N";
                    break;
                default:
                    prefix = "O";
                    break;
            }

            var year = DateTime.Now.Year;
            var sequentialNumber = _userRepository.GetNextSequentialNumberAsync().Result; // Obtém o próximo número sequencial

            string staffId = $"{prefix}{year}{sequentialNumber:D4}";

            return new StaffId(staffId);
        } */

    }
}
