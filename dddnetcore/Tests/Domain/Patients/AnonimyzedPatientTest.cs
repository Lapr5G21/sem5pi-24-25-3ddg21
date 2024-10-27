using System;
using Xunit;
using DDDSample1.Domain.Patients;

namespace DDDSample1.Domain.Tests
{
    public class AnonimyzedPatientTests
    {
        [Fact]
        public void Constructor_ShouldInitialize_PropertiesCorrectly()
        {
            // Arrange
            string appointmentHistory = "Consulta em 10/10/2024";
            string medicalRecord = "Histórico médico: Sem alergias.";

            // Act
            var anonimyzedPatient = new AnonimyzedPatient(appointmentHistory, medicalRecord);

            // Assert
            Assert.NotNull(anonimyzedPatient.Id);
            Assert.IsType<AnonimyzedPatientId>(anonimyzedPatient.Id);
            Assert.Equal(appointmentHistory, anonimyzedPatient.AppointmentHistoryString);
            Assert.Equal(medicalRecord, anonimyzedPatient.MedicalRecordString);
        }

        [Fact]
        public void Constructor_ShouldGenerate_NewGuidForId()
        {
            // Arrange
            string appointmentHistory1 = "Consulta em 10/10/2024";
            string medicalRecord1 = "Histórico médico: Sem alergias.";
            var patient1 = new AnonimyzedPatient(appointmentHistory1, medicalRecord1);
            
            // Act
            string appointmentHistory2 = "Consulta em 11/11/2024";
            string medicalRecord2 = "Histórico médico: Alergia a penicilina.";
            var patient2 = new AnonimyzedPatient(appointmentHistory2, medicalRecord2);

            // Assert
            Assert.NotEqual(patient1.Id, patient2.Id); // Garantir que os IDs são diferentes
        }
    }
}
