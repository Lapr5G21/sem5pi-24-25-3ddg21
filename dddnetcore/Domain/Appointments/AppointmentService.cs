using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.SurgeryRooms;
using DDDSample1.Domain.RoomTypes;
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

        public AppointmentService(
            IUnitOfWork unitOfWork,
            IAppointmentRepository repo,
            ISurgeryRoomRepository surgeryRoomRepository,
            IOperationRequestRepository operationRequestRepository,
            IOperationTypeRepository operationTypeRepository)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
            this._surgeryRoomRepo = surgeryRoomRepository;
            this._operationRequestRepo = operationRequestRepository;
            this._operationTypeRepo = operationTypeRepository;
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

        public async Task<AppointmentDto> AddAsync(CreatingAppointmentDto dto)
        {
            var surgeryRoom = await _surgeryRoomRepo.GetByIdAsync(new SurgeryRoomNumber(dto.SurgeryRoomId)) ??
                              throw new NullReferenceException("Surgery Room not found: " + dto.SurgeryRoomId);

            var operationRequest = await _operationRequestRepo.GetByIdAsync(new OperationRequestId(dto.OperationRequestId)) ??
                                   throw new NullReferenceException("Operation Request not found: " + dto.OperationRequestId);

            
            var operationType = await this._operationTypeRepo.GetByIdAsync(operationRequest.OperationTypeId);
            
            var appointment = new Appointment(surgeryRoom, operationRequest, new AppointmentDate(dto.Date));

            await this._repo.AddAsync(appointment);
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
                    DateAndTime = appointment.Date.Date
                };
        }
    }
}
