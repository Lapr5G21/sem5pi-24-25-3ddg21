using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using DDDSample1.Domain.Appointments;
using DDDSample1.Domain.OperationTypes;
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

      hospitalMap.Map[2][2] = 0;
      hospitalMap.Map[2][8] = 0;
      hospitalMap.Map[8][2] = 0;
      hospitalMap.Map[8][8] = 0;
 
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
  }
}








