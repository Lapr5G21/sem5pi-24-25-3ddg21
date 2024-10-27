using Xunit;
using DDDSample1.Domain.Patients;

namespace DDDSample1.Tests.Domain.Patients
{
    public class PatientAppointmentHistoryTests
    {
        [Theory]
        [InlineData("Appointment on 2025-01-01")]
        [InlineData("Appointment on 2025-02-15")]
        [InlineData("No previous appointments")]
        public void Constructor_ValidHistory_ShouldSetAppointmentHistoryString(string validHistory)
        {
            // Act
            var appointmentHistory = new PatientAppointmentHistory(validHistory);

            // Assert
            Assert.Equal(validHistory, appointmentHistory.AppointmentHistoryString);
        }

        [Fact]
        public void GetHashCode_ShouldReturnHashCodeOfAppointmentHistoryString()
        {
            // Arrange
            string history = "Appointment on 2025-01-01";
            var appointmentHistory = new PatientAppointmentHistory(history);

            // Act
            int hashCode = appointmentHistory.GetHashCode();

            // Assert
            Assert.Equal(history.GetHashCode(), hashCode);
        }

        [Fact]
        public void ToString_ShouldReturnAppointmentHistoryString()
        {
            // Arrange
            string history = "Appointment on 2025-01-01";
            var appointmentHistory = new PatientAppointmentHistory(history);

            // Act
            string result = appointmentHistory.ToString();

            // Assert
            Assert.Equal(history, result);
        }
    }
}
