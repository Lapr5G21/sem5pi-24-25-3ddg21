using DDDSample1.Domain.AppointmentsStaffs;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace dddnetcore.Infraestructure.AppointmentsStaffs
{
    internal class AppointmentStaffEntityTypeConfiguration : IEntityTypeConfiguration<AppointmentStaff>
    {
        public void Configure(EntityTypeBuilder<AppointmentStaff> builder)
        {
            // Definir a chave primária
            builder.HasKey(b => b.Id);

            // Relacionamento com Appointment
            builder.HasOne(b => b.Appointment)
                   .WithMany(b => b.AppointmentTeam)
                   .HasForeignKey("AppointmentId") // A chave estrangeira será "AppointmentId"
                   .OnDelete(DeleteBehavior.Cascade);

            // Relacionamento com Staff
            builder.HasOne(b => b.Staff)
                   .WithMany(b => b.AppointmentTeam)
                   .HasForeignKey("StaffId") // A chave estrangeira será "StaffId"
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
