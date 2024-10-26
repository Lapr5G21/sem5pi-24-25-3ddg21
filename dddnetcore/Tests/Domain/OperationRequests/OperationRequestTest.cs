using System;
using Xunit;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Staffs;
using DDDSample1.Domain.OperationRequest;

namespace DDDSample1.Tests.Domain.OperationRequest
{
    public class OperationRequestTests
    {
        [Fact]
        public void CreateOperationRequest_Success()
        {
            // Arrange
            var priority = Priority.Elective;
            var operationTypeId = new OperationTypeId(Guid.NewGuid());
            var deadlineDate = new DeadlineDate(DateTime.UtcNow.AddDays(30));
            var status = Status.onSchedule;
            var staffId = new StaffId(Guid.NewGuid());
            var patientMedicalRecordNumber = new PatientMedicalRecordNumber("MRN001");

            // Act
            var operationRequest = new DDDSample1.Domain.OperationRequest.OperationRequest(priority, operationTypeId, deadlineDate, status, staffId, patientMedicalRecordNumber);


            // Assert
            Assert.NotNull(operationRequest);
            Assert.Equal(priority, operationRequest.PriorityLevel);
            Assert.Equal(operationTypeId, operationRequest.OperationTypeId);
            Assert.Equal(deadlineDate, operationRequest.DeadlineDate);
            Assert.Equal(status, operationRequest.Status);
            Assert.Equal(staffId, operationRequest.StaffId);
            Assert.Equal(patientMedicalRecordNumber, operationRequest.PatientMedicalRecordNumber);
        }

        private DDDSample1.Domain.OperationRequest.OperationRequest CreateOperationRequest()
        {
            var priority = Priority.Elective;
            var operationTypeId = new OperationTypeId(Guid.NewGuid());
            var deadlineDate = new DeadlineDate(DateTime.UtcNow.AddDays(30));
            var status = Status.onSchedule;
            var staffId = new StaffId(Guid.NewGuid());
            var patientMedicalRecordNumber = new PatientMedicalRecordNumber("MRN001");

            return new DDDSample1.Domain.OperationRequest.OperationRequest(priority, operationTypeId, deadlineDate, status, staffId, patientMedicalRecordNumber);
        }

        [Fact]
        public void ChangeOperationRequestPriority_Success()
        {
            // Arrange
            var operationRequest = CreateOperationRequest();
            var newPriority = Priority.Urgent;

            // Act
            operationRequest.ChangeOperationRequestPriority(newPriority);

            // Assert
            Assert.Equal(newPriority, operationRequest.PriorityLevel);
        }

        [Fact]
        public void ChangeOperationRequestOperationTypeId_Success()
        {
            // Arrange
            var operationRequest = CreateOperationRequest();
            var newOperationTypeId = new OperationTypeId(Guid.NewGuid());

            // Act
            operationRequest.ChangeOperationRequestOperationTypeId(newOperationTypeId);

            // Assert
            Assert.Equal(newOperationTypeId, operationRequest.OperationTypeId);
        }

        [Fact]
        public void ChangeOperationRequestDeadline_Success()
        {
            // Arrange
            var operationRequest = CreateOperationRequest();
            var newDeadline = new DeadlineDate(DateTime.UtcNow.AddDays(60));

            // Act
            operationRequest.ChangeOperationRequestDeadline(newDeadline);

            // Assert
            Assert.Equal(newDeadline, operationRequest.DeadlineDate);
        }

        [Fact]
        public void ChangeOperationRequestStatus_Success()
        {
            // Arrange
            var operationRequest = CreateOperationRequest();
            var newStatus = Status.Scheduled;

            // Act
            operationRequest.ChangeOperationRequestStatus(newStatus);

            // Assert
            Assert.Equal(newStatus, operationRequest.Status);
        }

        [Fact]
        public void ChangeOperationRequestStaffId_Success()
        {
            // Arrange
            var operationRequest = CreateOperationRequest();
            var newStaffId = new StaffId(Guid.NewGuid());

            // Act
            operationRequest.ChangeOperationRequestStaffId(newStaffId);

            // Assert
            Assert.Equal(newStaffId, operationRequest.StaffId);
        }

        [Fact]
        public void ChangeOperationRequestPatientMedicalRecordNumber_Success()
        {
            // Arrange
            var operationRequest = CreateOperationRequest();
            var newPatientMedicalRecordNumber = new PatientMedicalRecordNumber("MRN002");

            // Act
            operationRequest.ChangeOperationRequestPatientMedicalRecordNumber(newPatientMedicalRecordNumber);

            // Assert
            Assert.Equal(newPatientMedicalRecordNumber, operationRequest.PatientMedicalRecordNumber);
        }
        
    }
}
