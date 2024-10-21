using DDDSample1.Domain.Patients;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DDDSample1.Infrastructure.Patients
{
    internal class PatientEntityTypeConfiguration : IEntityTypeConfiguration<Patient>
    {
        public void Configure(EntityTypeBuilder<Patient> builder)
        {
            // MedicalRecordNumber is the primary key
            builder.HasKey(p => p.MedicalRecordNumber);

            builder.Property(p => p.MedicalRecordNumber)
                .HasConversion(mrn => mrn.AsString(), mrn => new PatientMedicalRecordNumber(mrn))
                .IsRequired();

            builder.Property(p => p.FirstName)
                .HasConversion(fn => fn.FirstName, fn => new PatientFirstName(fn))
                .IsRequired();

            builder.Property(p => p.LastName)
                .HasConversion(ln => ln.LastName, ln => new PatientLastName(ln))
                .IsRequired();

            builder.Property(p => p.FullName)
                .HasConversion(fn => fn.FullName, fn => new PatientFullName(fn))
                .IsRequired();

            builder.Property(p => p.BirthDate)
                .HasConversion(
                    bd => bd.BirthDateString, bd => new PatientBirthDate(bd)
                )
                .IsRequired();

            builder.Property(p => p.Gender)
                .HasConversion(g => g.GenderValue, g => new PatientGender(g))
                .IsRequired();

            builder.Property(p => p.Email)
                .HasConversion(
                    em => em.EmailString, em => new PatientEmail(em)
                )
                .IsRequired();

            builder.Property(p => p.PhoneNumber)
                .HasConversion(
                    pn => pn.PhoneNumber, pn => new PatientPhoneNumber(pn)
                )
                .IsRequired();

            builder.Property(p => p.EmergencyContact)
                .HasConversion(ec => ec.EmergencyContact, ec => new PatientEmergencyContact(ec))
                .IsRequired();

            builder.Property(p => p.Active)
                .HasColumnName("IsActive")
                .IsRequired();
        }
    }
}
