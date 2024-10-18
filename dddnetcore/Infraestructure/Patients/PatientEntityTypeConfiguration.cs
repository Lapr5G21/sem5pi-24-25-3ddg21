using DDDSample1.Domain.Patients;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DDDSample1.Infrastructure.Patients
{
    internal class PatientEntityTypeConfiguration : IEntityTypeConfiguration<Patient>
    {
        public void Configure(EntityTypeBuilder<Patient> builder)
        {
            builder.HasKey(p => p.MedicalRecordNumber);

            builder.Property(p => p.FirstName)
                .HasConversion(fn => fn.FirstName, fn => new PatientFirstName(fn)  // Converte de string para PatientFirstName
                )
                .IsRequired();

            builder.Property(p => p.LastName)
                .HasConversion(ln => ln.LastName, ln => new PatientLastName(ln)  // Converte de string para PatientLastName
                )
                .IsRequired();

            builder.Property(p => p.FullName)
                .HasConversion(fn => fn.FullName, fn => new PatientFullName(fn)  // Converte de string para PatientFullName
                )
                .IsRequired();

            builder.Property(p => p.BirthDate)
                .HasConversion(
                    bd => bd.BirthDateString, bd => new PatientBirthDate(bd)  // Converte para PatientBirthDate
                )
                .IsRequired();

            builder.Property(p => p.Gender)
                .HasConversion(g => g.GenderValue,  g => new PatientGender(g)  // Converte de string para PatientGender
                )
                .IsRequired();

            builder.Property(p => p.Email)
                .HasConversion(
                    em => em.EmailString,
                    em => new PatientEmail(em)  // Converte de string para PatientEmail
                )
                .IsRequired();

            builder.Property(p => p.PhoneNumber)
                .HasConversion(
                    pn => pn.PhoneNumber,
                    pn => new PatientPhoneNumber(pn)  // Converte de string para PatientPhoneNumber
                )
                .IsRequired();

            // Configuração da propriedade EmergencyContact
            builder.Property(p => p.EmergencyContact)
                .HasConversion(ec => ec.EmergencyContact, ec => new PatientEmergencyContact(ec)  // Converte de string para PatientEmergencyContact
                )
                .IsRequired();

            // Configuração da propriedade Active
            builder.Property(p => p.Active)
                .HasColumnName("IsActive")
                .IsRequired();
        }
    }
}
