using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDSample1.Domain.Patients;

namespace DDDSample1.Infrastructure.Patients
{
    public class AnonimyzedPatientEntityTypeConfiguration : IEntityTypeConfiguration<AnonimyzedPatient>
    {
        public void Configure(EntityTypeBuilder<AnonimyzedPatient> builder)
        {
            builder.HasKey(a => a.Id);

            builder.Property(a => a.AppointmentHistoryString)
                .HasColumnName("AppointmentHistory")
                .IsRequired();

            builder.Property(a => a.MedicalRecordString)
                .HasColumnName("MedicalRecord")
                .IsRequired();

            builder.ToTable("AnonimyzedPatients");
        }
    }
}
