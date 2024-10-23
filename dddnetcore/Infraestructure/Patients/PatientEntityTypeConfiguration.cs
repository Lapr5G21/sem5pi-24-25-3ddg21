using DDDSample1.Domain.Patients;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DDDSample1.Infrastructure.Patients
{
    public class PatientEntityTypeConfiguration : IEntityTypeConfiguration<Patient>
    {
        public void Configure(EntityTypeBuilder<Patient> builder)
        {
            builder.HasKey(p => p.Id);

            builder.Property(p => p.FirstName)
                .HasConversion(b => b.FirstName, b => new PatientFirstName(b))
                .IsRequired();

            builder.Property(p => p.LastName)
                .HasConversion(b => b.LastName, b => new PatientLastName(b))
                .IsRequired();

            builder.Property(p => p.FullName)
                .HasConversion(b => b.FullName, b => new PatientFullName(b))
                .IsRequired();

            builder.Property(p => p.BirthDate)
                .HasConversion(b => b.BirthDateString, b => new PatientBirthDate(b))
                .IsRequired();

            builder.Property(p => p.Gender)
                .HasConversion(
                    g => g.GenderValue, // Convert PatientGender to Gender enum
                    g => new PatientGender(g) // Convert Gender enum back to PatientGender
                )
                .IsRequired();

            builder.Property(p => p.Email)
                .HasConversion(b => b.EmailString, b => new PatientEmail(b))
                .IsRequired();

            builder.Property(p => p.PhoneNumber)
                .HasConversion(b => b.PhoneNumber, b => new PatientPhoneNumber(b))
                .IsRequired();

            builder.Property(p => p.Address)
                .HasConversion(b => b.AddressString, b => new PatientAddress(b))
                .IsRequired();    

            builder.Property(p => p.MedicalRecord)
                .HasConversion(b => b.MedicalRecord, b => new PatientMedicalRecord(b))
                .IsRequired(false);

            builder.Property(p => p.EmergencyContact)
                .HasConversion(b => b.EmergencyContact, b => new PatientEmergencyContact(b))
                .IsRequired();

            builder.Property(p => p.AppointmentHistory)
                .HasConversion(b => b.AppointmentHistoryString, b => new PatientAppointmentHistory(b))
                .IsRequired(false);    

            builder.Property(p => p.Active)
                .IsRequired();

            builder.HasOne(p => p.User)
                .WithMany()
                .HasForeignKey("UserId")
                .IsRequired(false);
        }
    }
}
