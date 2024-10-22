using Xunit;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Tests.Domain.Patients
{
    public class PatientEmailTests
    {
        [Fact]
        public void CreatePatientEmail_WithValidEmail_ShouldCreateSuccessfully()
        {
            // Arrange
            string validEmail = "john.doe@example.com";
            
            // Act
            var email = new PatientEmail(validEmail);
            
            // Assert
            Assert.NotNull(email);
            Assert.Equal(validEmail, email.EmailString);
        }
    }
}