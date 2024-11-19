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
using DDDSample1.Domain.Emails;
using DDDSample1.Domain.AuditLogs;
using DDDSample1.Infrastructure.Staffs;

namespace DDDSample1.Domain.Staffs
{
    public class StaffService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IStaffRepository _staffRepository;
        private readonly IConfiguration _configuration;
        private readonly ISpecializationRepository _specializationRepository;
        private readonly IUserRepository _userRepository;
        private readonly IEmailService _emailService;
        private readonly ILogRepository _logRepository;
        private readonly IAvailabilitySlotRepository _availabilitySlotRepository;

        public StaffService(IUnitOfWork unitOfWork, IStaffRepository staffRepository, IConfiguration configuration, ISpecializationRepository specializationRepository, IUserRepository userRepository, IEmailService emailService, ILogRepository logRepository,IAvailabilitySlotRepository availabilitySlotRepository)
        {
            _unitOfWork = unitOfWork;
            _staffRepository = staffRepository;
            _configuration = configuration;
            _specializationRepository = specializationRepository;
            _userRepository = userRepository;
            _emailService=emailService;
            _logRepository = logRepository;
            _availabilitySlotRepository = availabilitySlotRepository;
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
                StaffAvailabilitySlots = staff.AvailabilitySlots,
                UserId = staff.UserId.ToString(),
                Active = staff.Active
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
                StaffAvailabilitySlots = staff.AvailabilitySlots,
                UserId = staff.UserId.ToString()
            };
        }
        public async Task<StaffDto> AddAsync(CreatingStaffDto dto)
        {
            Console.WriteLine(dto.UserId);
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
                user.Id
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

            var oldEmail = staff.StaffEmail.ToString();
            var oldPhoneNumber = staff.StaffPhoneNumber.ToString();
            var oldFirstName = staff.StaffFirstName.ToString();
            var oldLastName = staff.StaffLastName.ToString();
            var oldSpecialization = staff.SpecializationId?.ToString() ?? "N/A";
            
            staff.ChangeFirstName(new StaffFirstName(dto.FirstName));
            staff.ChangeLastName(new StaffLastName(dto.LastName));
            staff.ChangeFullName(new StaffFullName(dto.FullName));
            staff.ChangeEmail(new StaffEmail(dto.Email));
            staff.ChangePhoneNumber(new StaffPhoneNumber(dto.PhoneNumber));
            staff.ChangeSpecialization(new SpecializationId(dto.SpecializationId));
            await this._unitOfWork.CommitAsync();

            if (oldEmail != staff.StaffEmail.ToString() || oldPhoneNumber != staff.StaffPhoneNumber.ToString())
            {
                List<string> toEmail = new List<string> { staff.StaffEmail.ToString() };
                await _emailService.SendEmailAsync(toEmail, "Your contact information has been updated.",
                "Dear " + staff.StaffFullName.ToString() + ",\n\n" +
                "Your contact information has been successfully updated.\n\n" +
                "Thank you,\n" +
                "The HealthCare Team");
            }

            var changes = new List<string>();

            if (oldFirstName != staff.StaffFirstName.ToString())
                changes.Add($"First Name: '{oldFirstName}' to '{staff.StaffFirstName}'");
            if (oldLastName != staff.StaffLastName.ToString())
                changes.Add($"Last Name: '{oldLastName}' to '{staff.StaffLastName}'");
            if (oldEmail != staff.StaffEmail.ToString())
                changes.Add($"Email: '{oldEmail}' to '{staff.StaffEmail}'");
            if (oldPhoneNumber != staff.StaffPhoneNumber.ToString())
                changes.Add($"Phone Number: '{oldPhoneNumber}' to '{staff.StaffPhoneNumber}'");
            if (oldSpecialization != staff.SpecializationId.ToString())
                changes.Add($"Specialization: '{oldSpecialization}' to '{staff.SpecializationId}'");

            var details = string.Join(", ", changes);

            var log = _logRepository.LogUpdateOperation(LogCategoryType.STAFF_PROFILE, $"Updated Staff {staff.StaffFullName}: {details}");
            await _logRepository.AddAsync(log);

            await this._unitOfWork.CommitAsync();
            return new StaffDto
            {
                StaffId = staff.Id.AsString() ?? "N/A",
                StaffFirstName = staff.StaffFirstName?.ToString() ?? "N/A",
                StaffLastName = staff.StaffLastName?.ToString() ?? "N/A",
                StaffFullName = staff.StaffFullName?.ToString() ?? "N/A",
                StaffLicenseNumber = staff.StaffLicenseNumber?.ToString() ?? "N/A",
                SpecializationId = staff.SpecializationId.AsString(),
                StaffEmail = staff.StaffEmail?.ToString() ?? "N/A",
                StaffPhoneNumber = staff.StaffPhoneNumber?.ToString() ?? "N/A",
                StaffAvailabilitySlots = staff.AvailabilitySlots,
                UserId = staff.UserId?.ToString() ?? "N/A"
            };
        }

        public AvailabilitySlot AddAvailabilitySlot(CreatingAvailabitySlotDto dto)
        {

            StaffId staffId = new StaffId(dto.StaffId);
           var staff = this._staffRepository.GetByIdAsync(staffId).Result; 
            if (staff == null) return null;
            var slot = staff.AddAvailabilitySlot(dto.Start, dto.End, staffId);
            this._unitOfWork.CommitAsync();
            return slot;
        }

        internal async Task<StaffDto> InactivateAsync(StaffId id)
        {
            
            var staff = await this._staffRepository.GetByIdAsync(id);
            if (staff == null) return null;

            staff.Deactivate();
            var log = _logRepository.LogDeactivationOperation(LogCategoryType.STAFF_PROFILE, $"Deactivated Staff {staff.StaffFullName} with this email {staff.StaffEmail}");
            await _logRepository.AddAsync(log);

            await this._unitOfWork.CommitAsync();
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
                StaffAvailabilitySlots = staff.AvailabilitySlots,
                UserId = staff.UserId.ToString(),
                Active = staff.Active
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
                StaffId = staff.Id.AsString(),
                StaffFirstName = staff.StaffFirstName.ToString(),
                StaffLastName = staff.StaffLastName.ToString(),
                StaffFullName = staff.StaffFullName.ToString(),
                StaffLicenseNumber = staff.StaffLicenseNumber.ToString(),
                SpecializationId = staff.SpecializationId.AsString(),
                StaffEmail = staff.StaffEmail.ToString(),
                StaffPhoneNumber = staff.StaffPhoneNumber.ToString(),
                StaffAvailabilitySlots = staff.AvailabilitySlots,
                UserId = staff.UserId.ToString()
            };
        }

       public async Task<IEnumerable<StaffDto>> SearchStaffAsync(StaffSearchDto searchDto)
        {
            var filteredStaffs = await _staffRepository.SearchAsync(searchDto);

            return filteredStaffs.Select(s => new StaffDto
            {
                StaffId = s.Id.AsString(),
                StaffFirstName = s.StaffFirstName.ToString(),
                StaffLastName = s.StaffLastName.ToString(),
                StaffFullName = s.StaffFullName.ToString(),
                StaffLicenseNumber = s.StaffLicenseNumber.ToString(),
                SpecializationId = s.SpecializationId.AsString(),
                StaffEmail = s.StaffEmail.ToString(),
                StaffPhoneNumber = s.StaffPhoneNumber.ToString(),
                StaffAvailabilitySlots = s.AvailabilitySlots,
                UserId = s.UserId.ToString(),
                Active = s.Active
            }).ToList();
        }

         public async Task<List<AvailabilitySlotDto>> GetAvailabilitySlotsAsync(string staffId)
        {
        var availabilitySlots = await _availabilitySlotRepository.GetByStaffIdAsync(new StaffId(staffId));

        if (availabilitySlots == null)
        {
            throw new ArgumentException("Staff not found or has no availability slots.");
        }

        return availabilitySlots
            .Select(slot => new AvailabilitySlotDto
            {
                Id = slot.Id.AsString(),
                StaffId = slot.StaffId.AsString(),
                Start = slot.Start,
                End = slot.End
            })
            .ToList();
    }

public async Task<AvailabilitySlot> RemoveAvailabilitySlotAsync(string staffId, DateTime start, DateTime end)
{
    StaffId id = new StaffId(staffId);
    var staff = await _staffRepository.GetByIdAsync(id);
    
    if (staff == null)
    {
        return null;
    }

    var slotRemoved = staff.RemoveAvailabilitySlot(id, start, end);

    if (slotRemoved != null)
    {
        await _unitOfWork.CommitAsync();
        return slotRemoved;
    }

    return null;
}

    }
}
