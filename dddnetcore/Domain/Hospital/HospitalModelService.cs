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

    private readonly OperationTypeRepository _operationTypeRepository;

    private static readonly Dictionary<int, (int Row, int Col)> roomsMap = new Dictionary<int, (int Row, int Col)>{
        {1, (3,3)},
        {2, (3,9)},
        {3, (9,3)},
        {4, (9,9)}
    };

    public HospitalModelService(IAppointmentRepository appointmentRepository, OperationTypeRepository operationTypeRepository)
    {
      _appointmentRepository = appointmentRepository;
      _operationTypeRepository = operationTypeRepository;
    }

    public int ParseRoomNumber(SurgeryRoomNumber roomNumber)
{
    // Verifica se roomNumber ou Id são nulos para evitar exceções
    if (roomNumber == null || string.IsNullOrEmpty(roomNumber.Id))
        throw new ArgumentException("Room number ID cannot be null or empty.");

    // Usa expressão regular para capturar o primeiro número encontrado na string
    var match = System.Text.RegularExpressions.Regex.Match(roomNumber.Id, @"\d+");
    
    if (match.Success)
    {
        return int.Parse(match.Value); // Converte o número encontrado para inteiro
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
 
      // Get the current time for comparison
      var currentTime = DateTime.Now;
 
      // Iterate over the appointments and modify the map as needed
      foreach (var appointment in appointments)
      {
        
        var roomNumber = ParseRoomNumber(appointment.Room?.Id); 
        var status = appointment.Room?.Status;
        var dateAndTime = appointment.Date;
        var operationRequest = appointment.OperationRequest;
 
        if (roomNumber != null && status == SurgeryRoomStatus.AVAILABLE)
        {
          // Get the room from the number
          var room = roomsMap[roomNumber];
 
          // Calculate the end time of the operation
          var appointmentStart = DateTime.Parse(dateAndTime.ToString());
          OperationType operationType =  await _operationTypeRepository.GetByIdAsync(operationRequest.OperationTypeId);
          double durationMinutes = Convert.ToDouble(operationType.EstimatedTimeDuration);

          var appointmentEnd = appointmentStart.AddMinutes(durationMinutes);
 
          // Check if the operation is in progress (now)
          if (currentTime >= appointmentStart && currentTime <= appointmentEnd)
          {
            // Mark the room as occupied on the map (5 = occupied)
            hospitalMap.Map[room.Row][room.Col] = 5;
          }
          else
          {
            // Otherwise, mark the room as free (4 = free)
            hospitalMap.Map[room.Row][room.Col] = 4;
          }
        }
      }
 
      // Save the modifications to the JSON file
      System.IO.File.WriteAllText(_filePath, JsonConvert.SerializeObject(hospitalMap, Formatting.Indented));
 
      return hospitalMap;
    }
  }
}








