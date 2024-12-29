using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.SurgeryRooms;
using DDDSample1.Domain.RoomTypes;
using DDDSample1.Domain.Specializations;
using DDDSample1.Domain.Staffs;
using DDDSample1.Domain.AppointmentsStaffs;
using DDDSample1.Domain.Users;

namespace DDDSample1.Domain.Appointments
{
    public class AppointmentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAppointmentRepository _repo;
        private readonly ISurgeryRoomRepository _surgeryRoomRepo;
        private readonly IOperationRequestRepository _operationRequestRepo;
        private readonly IOperationTypeRepository _operationTypeRepo;
        private readonly IAppointmentStaffRepository _appointmentStaffRepo;
        private readonly IStaffRepository _staffRepo;
        private readonly ISpecializationRepository _specializationRepo;




        public AppointmentService(
            IUnitOfWork unitOfWork,
            IAppointmentRepository repo,
            ISurgeryRoomRepository surgeryRoomRepository,
            IOperationRequestRepository operationRequestRepository,
            IOperationTypeRepository operationTypeRepository,
            IAppointmentStaffRepository appointmentStaffRepo,
            IStaffRepository staffRepo,
            ISpecializationRepository specializationRepo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
            this._surgeryRoomRepo = surgeryRoomRepository;
            this._operationRequestRepo = operationRequestRepository;
            this._operationTypeRepo = operationTypeRepository;
            this._appointmentStaffRepo = appointmentStaffRepo;
            this._staffRepo = staffRepo;
            this._specializationRepo = specializationRepo;
        }

        public async Task<List<AppointmentDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();

            var listDto = new List<AppointmentDto>();

            foreach (var appointment in list)
            {
                Console.WriteLine("OpId" + appointment.OperationRequestId);
                Console.WriteLine("RoomNumber" + appointment.RoomNumber.Value);               
            var operationRequest = await this._operationRequestRepo.GetByIdAsync(appointment.OperationRequestId);

            var operationType = await this._operationTypeRepo.GetByIdAsync(operationRequest.OperationTypeId);
                listDto.Add(new AppointmentDto
                {
                    Id = appointment.Id.AsGuid(),
                    SurgeryRoomDto = new SurgeryRoomDto
                    {
                        Id= appointment.Room.Id.Value,
                        RoomType = new RoomTypeDto{Code = appointment.Room.RoomType.Id.Value, Designation = appointment.Room.RoomType.Designation.Value, Description = appointment.Room.RoomType.Description?.Value, IsSuitableForSurgery = appointment.Room.RoomType.SurgerySuitability.IsSuitableForSurgery},
                        RoomCapacity = appointment.Room.RoomCapacity.Capacity,
                        Status = appointment.Room.Status.ToString(),
                        MaintenanceSlots = appointment.Room.MaintenanceSlots.MaintenanceSlots,
                        Equipment = appointment.Room.Equipment.Equipment
                    },
                    OperationRequestDto = new OperationRequestWithAllDataDto
                    {
                        Id = operationRequest.Id.AsGuid(),
                        DoctorId = operationRequest.StaffId.AsString(),
                        OperationType = new OperationTypeDto
                        {
                            Id = operationType.Id.AsGuid(),
                            Name = operationType.Name.Name,
                            EstimatedDuration = operationType.EstimatedTimeDuration.Minutes,
                            SurgeryTime = operationType.SurgeryTime.Minutes,
                            AnesthesiaTime = operationType.AnesthesiaTime.Minutes,
                            CleaningTime = operationType.CleaningTime.Minutes
                        },
                        MedicalRecordNumber = operationRequest.PatientMedicalRecordNumber.Value,
                        Deadline = operationRequest.DeadlineDate.Value.ToString("yyyy-MM-dd"),
                        Priority = operationRequest.PriorityLevel.ToString(),
                        Status = operationRequest.Status.ToString()
                    },
                    Status = appointment.Status.ToString(),
                    DateAndTime = appointment.Date.Date
                });
            }

            return listDto;
        }

        public async Task<AppointmentDto> GetByIdAsync(AppointmentId id)
        {
            var appointment = await this._repo.GetByIdAsync(id);

            if (appointment == null)
                return null;

            var operationRequest = await this._operationRequestRepo.GetByIdAsync(appointment.OperationRequest.Id);
            var operationType = await this._operationTypeRepo.GetByIdAsync(operationRequest.OperationTypeId);

            return new AppointmentDto
                {
                    Id = appointment.Id.AsGuid(),
                    SurgeryRoomDto = new SurgeryRoomDto
                    {
                        Id= appointment.Room.Id.Value,
                        RoomType = new RoomTypeDto{Code = appointment.Room.RoomType.Id.Value, Designation = appointment.Room.RoomType.Designation.Value, Description = appointment.Room.RoomType.Description?.Value, IsSuitableForSurgery = appointment.Room.RoomType.SurgerySuitability.IsSuitableForSurgery},
                        RoomCapacity = appointment.Room.RoomCapacity.Capacity,
                        Status = appointment.Room.Status.ToString(),
                        MaintenanceSlots = appointment.Room.MaintenanceSlots.MaintenanceSlots,
                        Equipment = appointment.Room.Equipment.Equipment
                    },
                    OperationRequestDto = new OperationRequestWithAllDataDto
                    {
                        Id = operationRequest.Id.AsGuid(),
                        DoctorId = operationRequest.StaffId.AsString(),
                        OperationType = new OperationTypeDto
                        {
                            Id = operationType.Id.AsGuid(),
                            Name = operationType.Name.Name,
                            EstimatedDuration = operationType.EstimatedTimeDuration.Minutes,
                            SurgeryTime = operationType.SurgeryTime.Minutes,
                            AnesthesiaTime = operationType.AnesthesiaTime.Minutes,
                            CleaningTime = operationType.CleaningTime.Minutes
                        },
                        MedicalRecordNumber = operationRequest.PatientMedicalRecordNumber.Value,
                        Deadline = operationRequest.DeadlineDate.Value.ToString("yyyy-MM-dd"),
                        Priority = operationRequest.PriorityLevel.ToString(),
                        Status = operationRequest.Status.ToString()
                    },
                    Status = appointment.Status.ToString(),
                    DateAndTime = appointment.Date.Date
                };
        }


        private async Task ValidateStaffSpecializationsAsync(List<string> staffIds, OperationType operationType)
        {
            var requiredSpecializations = operationType.Specializations;

            var staffSpecializationCount = new Dictionary<Specialization, int>();

            foreach (var staffId in staffIds)
            {
                var staff = await _staffRepo.GetByIdAsync(new StaffId(staffId))
                    ?? throw new NullReferenceException($"Staff with ID {staffId} not found.");

                var staffSpecialization = await _specializationRepo.GetByIdAsync(staff.SpecializationId)
                    ?? throw new NullReferenceException($"Specilization with ID {staff.SpecializationId} not found.");

                var requiredSpecialization = requiredSpecializations
                    .FirstOrDefault(rs => rs.Specialization.Id == staffSpecialization.Id);

                if (requiredSpecialization == null)
                {
                    throw new BusinessRuleValidationException($"Staff {staffId} does not have the required specialization.");
                }
                if (!staffSpecializationCount.ContainsKey(staffSpecialization))
                {
                    staffSpecializationCount[staffSpecialization] = 1;
                }
                else
                {
                    staffSpecializationCount[staffSpecialization]++;
                }
            }

            foreach (var requiredSpecialization in requiredSpecializations)
            {
                if (staffSpecializationCount.ContainsKey(requiredSpecialization.Specialization))
                {
                    if (staffSpecializationCount[requiredSpecialization.Specialization] < requiredSpecialization.NumberOfStaff.Number)
                    {
                        throw new BusinessRuleValidationException($"Not enough staff for the specialization {requiredSpecialization.Specialization.SpecializationName.Name}. Required: {requiredSpecialization.NumberOfStaff.Number}, Available: {staffSpecializationCount[requiredSpecialization.Specialization]}");
                    }
                }
                else
                {
                    throw new BusinessRuleValidationException($"No staff available for the specialization {requiredSpecialization.Specialization.SpecializationName.Name}.");
                }
            }
        }


        public async Task<AppointmentDto> AddAsync(CreatingAppointmentDto dto)
        {
            var surgeryRoom = await _surgeryRoomRepo.GetByIdAsync(new SurgeryRoomNumber(dto.SurgeryRoomId)) ??
                              throw new NullReferenceException("Surgery Room not found: " + dto.SurgeryRoomId);

            var operationRequest = await _operationRequestRepo.GetByIdAsync(new OperationRequestId(dto.OperationRequestId)) ??
                                   throw new NullReferenceException("Operation Request not found: " + dto.OperationRequestId);

            
            var operationType = await this._operationTypeRepo.GetByIdAsync(operationRequest.OperationTypeId);

            var startTime = DateTime.Parse(dto.Date);
            var endTime = startTime.AddMinutes(operationType.EstimatedTimeDuration.Minutes);

            var isRoomAvailable = await _surgeryRoomRepo.IsRoomAvailableAsync(surgeryRoom.Id, startTime, endTime);

            if (!isRoomAvailable)
            {
                throw new BusinessRuleValidationException("The room is not available for the chosen time.");
            }

            await ValidateStaffSpecializationsAsync(dto.TeamIds, operationType);

            var isStaffAvailable = true;
            foreach (var id in dto.TeamIds)
            {
                var staffId = new StaffId(id);
                isStaffAvailable &= await _appointmentStaffRepo.IsStaffAvailableAsync(staffId, startTime, endTime);
            }

            if (!isStaffAvailable)
            {
                throw new BusinessRuleValidationException("At least one staff member is unavailable for the chosen time.");
            }
            
            var appointment = new Appointment(surgeryRoom, operationRequest, new AppointmentDate(DateTime.Parse(dto.Date)));

            await this._repo.AddAsync(appointment);

            foreach (var staffId in dto.TeamIds)
            {
                var staff = await _staffRepo.GetByIdAsync(new StaffId(staffId))
                            ?? throw new NullReferenceException("Staff not found: " + staffId);

                var appointmentStaff = new AppointmentStaff(appointment, staff);
                await _appointmentStaffRepo.AddAsync(appointmentStaff);
            }

            operationRequest.ChangeOperationRequestStatus(Status.Scheduled);
            await this._operationRequestRepo.UpdateAsync(operationRequest);
            
            await this._unitOfWork.CommitAsync();

            return new AppointmentDto
                {
                    Id = appointment.Id.AsGuid(),
                    SurgeryRoomDto = new SurgeryRoomDto
                    {
                        Id= appointment.Room.Id.Value,
                        RoomType = new RoomTypeDto{Code = appointment.Room.RoomType.Id.Value, Designation = appointment.Room.RoomType.Designation.Value, Description = appointment.Room.RoomType.Description?.Value, IsSuitableForSurgery = appointment.Room.RoomType.SurgerySuitability.IsSuitableForSurgery},
                        RoomCapacity = appointment.Room.RoomCapacity.Capacity,
                        Status = appointment.Room.Status.ToString(),
                        MaintenanceSlots = appointment.Room.MaintenanceSlots.MaintenanceSlots,
                        Equipment = appointment.Room.Equipment.Equipment
                    },
                    OperationRequestDto = new OperationRequestWithAllDataDto
                    {
                        Id = operationRequest.Id.AsGuid(),
                        DoctorId = operationRequest.StaffId.AsString(),
                        OperationType = new OperationTypeDto
                        {
                            Id = operationType.Id.AsGuid(),
                            Name = operationType.Name.Name,
                            EstimatedDuration = operationType.EstimatedTimeDuration.Minutes,
                            SurgeryTime = operationType.SurgeryTime.Minutes,
                            AnesthesiaTime = operationType.AnesthesiaTime.Minutes,
                            CleaningTime = operationType.CleaningTime.Minutes
                        },
                        MedicalRecordNumber = operationRequest.PatientMedicalRecordNumber.Value,
                        Deadline = operationRequest.DeadlineDate.Value.ToString("yyyy-MM-dd"),
                        Priority = operationRequest.PriorityLevel.ToString(),
                        Status = operationRequest.Status.ToString()
                    },
                    Status = appointment.Status.ToString(),
                    DateAndTime = appointment.Date.Date,
                    Team = appointment.AppointmentTeam.Select(a => new StaffDto(a.Staff)).ToList()
                };
        }
    }
}
