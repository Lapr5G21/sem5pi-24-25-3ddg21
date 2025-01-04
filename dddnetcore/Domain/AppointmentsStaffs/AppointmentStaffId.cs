using System;
using System.Text.Json.Serialization;
using DDDSample1.Domain.Staffs;
using DDDSample1.Domain.Appointments;
using DDDSample1.Domain.Shared;
using FluentAssertions;

namespace DDDSample1.Domain.AppointmentsStaffs {
    
  public class AppointmentStaffId : EntityId {

        public AppointmentId AppointmentId { get; }
        public StaffId StaffId { get; }

        public AppointmentStaffId(string id) : base(id)
{
    if (string.IsNullOrWhiteSpace(id))
        throw new ArgumentException("ID cannot be null or empty.", nameof(id));

    var lastDashIndex = id.LastIndexOf('-');
    if (lastDashIndex == -1)
        throw new FormatException("Invalid format for AppointmentStaffId. Expected format: '<AppointmentId>-<StaffId>'");

    var appointmentId = id.Substring(0, lastDashIndex);
    var staffId = id.Substring(lastDashIndex + 1);

    if (!Guid.TryParse(appointmentId, out _))
        throw new FormatException($"Invalid AppointmentId format: '{appointmentId}'");

    AppointmentId = new AppointmentId(appointmentId);
    StaffId = new StaffId(staffId);
}

        [JsonConstructor]
        public AppointmentStaffId(AppointmentId appointmentId, StaffId staffId) 
            : base($"{appointmentId.AsGuid()}-{staffId.AsString()}")
        {
            AppointmentId = appointmentId ?? throw new ArgumentNullException(nameof(appointmentId));
            StaffId = staffId ?? throw new ArgumentNullException(nameof(staffId));

            Console.WriteLine($"DEBUG: AppointmentId -> {appointmentId.AsGuid()}");
            Console.WriteLine($"DEBUG: StaffId -> {staffId.AsString()}");
        }

        public override string AsString()
        {
            return $"{AppointmentId.AsGuid()}-{StaffId.AsString()}";
        }
        protected override object createFromString(String content) {
            return content; 
        }
}
}