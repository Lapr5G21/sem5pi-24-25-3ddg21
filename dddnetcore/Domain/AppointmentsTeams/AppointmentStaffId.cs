using System;
using System.Text.Json.Serialization;
using DDDSample1.Domain.Staffs;
using DDDSample1.Domain.Appointments;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.AppointmentsTeams {
    
  public class AppointmentStaffId : EntityId {

        public AppointmentId AppointmentId { get; }
        public StaffId StaffId { get; }

        public AppointmentStaffId(string id) : base(id)
        {
            if (string.IsNullOrWhiteSpace(id))
                throw new ArgumentException("ID cannot be null or empty.", nameof(id));

            var segments = id.Split('-');
            if (segments.Length != 2)
                throw new FormatException("Invalid format for AppointmentStaffId. Expected format: '<AppointmentId>-<StaffId>'");

            AppointmentId = new AppointmentId(segments[0]);
            StaffId = new StaffId(segments[1]);
        }

        [JsonConstructor]
        public AppointmentStaffId(AppointmentId appointmentId, StaffId staffId) 
            : base($"{appointmentId.AsGuid()}-{staffId.Value}")
        {
            AppointmentId = appointmentId ?? throw new ArgumentNullException(nameof(appointmentId));
            StaffId = staffId ?? throw new ArgumentNullException(nameof(staffId));
        }

        public override string AsString()
        {
            return $"{AppointmentId.AsGuid()}-{StaffId.Value}";
        }
        protected override object createFromString(String content) {
            return content; 
        }
}
}