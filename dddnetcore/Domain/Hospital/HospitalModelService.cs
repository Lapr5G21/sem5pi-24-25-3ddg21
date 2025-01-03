using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using DDDSample1.Domain.Appointments;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.RoomTypes;
using DDDSample1.Domain.SurgeryRooms;
using DDDSample1.Infrastructure.OperationTypes;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Sprache;



namespace DDDSample1.Domain.Hospital{

public class HospitalModelService
{
    private readonly string _filePath = Path.Combine(Directory.GetCurrentDirectory(), "./hospital/hospital.json");
    private readonly IAppointmentRepository _appointmentRepository;

    private readonly IOperationTypeRepository _operationTypeRepository;

    private static readonly Dictionary<int, (int Row, int Col)> roomsMap = new Dictionary<int, (int Row, int Col)>{
        {1, (2,2)},
        {2, (2,8)},
        {3, (8,2)},
        {4, (8,8)}
    };

    public HospitalModelService(IAppointmentRepository appointmentRepository, IOperationTypeRepository operationTypeRepository)
    {
      _appointmentRepository = appointmentRepository;
      _operationTypeRepository = operationTypeRepository;
    }

    public int ParseRoomNumber(SurgeryRoomNumber roomNumber)
{
    if (roomNumber == null || string.IsNullOrEmpty(roomNumber.Id))
        throw new ArgumentException("Room number ID cannot be null or empty.");

    var match = System.Text.RegularExpressions.Regex.Match(roomNumber.Id, @"\d+");
    
    if (match.Success)
    {
        return int.Parse(match.Value); 
    }
    
    throw new FormatException("No valid number found in the room number ID.");
}

    public async Task<HospitalMap> GetHospitalMap()
    {
      // Check if the JSON file exists
      if (!System.IO.File.Exists(_filePath))
        return null;
 
      // Get all appointments
      var appointments = await _appointmentRepository.GetAllAsync();
 
      // Read the content of the JSON file
      var jsonContent = System.IO.File.ReadAllText(_filePath);
      var hospitalMap = JsonConvert.DeserializeObject<HospitalMap>(jsonContent);

      hospitalMap.Map[2][2] = 4;
      hospitalMap.Map[2][8] = 4;
      hospitalMap.Map[8][2] = 4;
      hospitalMap.Map[8][8] = 4;
 
      // Get the current time for comparison
      var currentTime = new DateTimeOffset(DateTime.Now).ToUnixTimeMilliseconds();
 
      // Iterate over the appointments and modify the map as needed
      foreach (var appointment in appointments)
      {
        
        var roomNumber = ParseRoomNumber(appointment.Room?.Id); 
        var status = appointment.Room?.Status;
        var operationRequest = appointment.OperationRequest;

        if (roomNumber != null)
        {
           
          // Get the room from the number
          var room = roomsMap[roomNumber];
 
 
          // Calculate the end time of the operation
        
          OperationType operationType =  await _operationTypeRepository.GetByIdAsync(operationRequest.OperationTypeId);
       
          var operationStartTime = new DateTimeOffset(appointment.Date.Date).ToUnixTimeMilliseconds();
          var operationEndTime = new DateTimeOffset(appointment.Date.Date).AddMinutes(operationType.EstimatedTimeDuration.Minutes).ToUnixTimeMilliseconds();
 
          
          Console.WriteLine("RoomNumber:" + roomNumber);
          
          // Check if the operation is in progress (now)
          if (currentTime >= operationStartTime && currentTime <= operationEndTime)
          {            
            // Mark the room as occupied on the map (8 = occupied)
            hospitalMap.Map[room.Row][room.Col] = 8;
          }
          else
          {
            // Otherwise, mark the room as free (4 = free)
            if(hospitalMap.Map[room.Row][room.Col] != 8){

            hospitalMap.Map[room.Row][room.Col] = 4;
            }
          }
        }
      }
 
      // Save the modifications to the JSON file
      System.IO.File.WriteAllText(_filePath, JsonConvert.SerializeObject(hospitalMap, Formatting.Indented));
 
      return hospitalMap;
    }


  public async Task<AppointmentDto> GetCurrentAppointmentsByRoomIdAsync(SurgeryRoomNumber roomId){
    var appointments = await _appointmentRepository.GetAppointmentsBySurgeryRoom(roomId);
    AppointmentDto currentAppointmentDto = null;
    var currentTime = new DateTimeOffset(DateTime.Now).ToUnixTimeMilliseconds();

    foreach (Appointment appointment in appointments){
          OperationType operationType =  await _operationTypeRepository.GetByIdAsync(appointment.OperationRequest.OperationTypeId);
          var operationStartTime = new DateTimeOffset(appointment.Date.Date).ToUnixTimeMilliseconds();
          var operationEndTime = new DateTimeOffset(appointment.Date.Date).AddMinutes(operationType.EstimatedTimeDuration.Minutes).ToUnixTimeMilliseconds();

          if (currentTime >= operationStartTime && currentTime <= operationEndTime)
          {            
            currentAppointmentDto = new AppointmentDto{
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
                        Id = appointment.OperationRequest.Id.AsGuid(),
                        DoctorId = appointment.OperationRequest.StaffId.AsString(),
                        OperationType = new Appointments.OperationTypeDto
                        {
                            Id = operationType.Id.AsGuid(),
                            Name = operationType.Name.Name,
                            EstimatedDuration = operationType.EstimatedTimeDuration.Minutes,
                            SurgeryTime = operationType.SurgeryTime.Minutes,
                            AnesthesiaTime = operationType.AnesthesiaTime.Minutes,
                            CleaningTime = operationType.CleaningTime.Minutes
                        },
                        MedicalRecordNumber = appointment.OperationRequest.PatientMedicalRecordNumber.Value,
                        Deadline = appointment.OperationRequest.DeadlineDate.Value.ToString("yyyy-MM-dd"),
                        Priority = appointment.OperationRequest.PriorityLevel.ToString(),
                        Status = appointment.OperationRequest.Status.ToString()
                    },
                    Status = appointment.Status.ToString(),
                    DateAndTime = appointment.Date.Date
                };
          }
    }

    return currentAppointmentDto;
  }
}
}









