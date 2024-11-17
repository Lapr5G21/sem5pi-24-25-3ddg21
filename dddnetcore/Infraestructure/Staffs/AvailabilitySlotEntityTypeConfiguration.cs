using System;
using DDDSample1.Domain.Staffs;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DDDSample1.Infrastructure.Staffs
{
    internal class AvailabilitySlotEntityTypeConfiguration : IEntityTypeConfiguration<AvailabilitySlot>
    {
        public void Configure(EntityTypeBuilder<AvailabilitySlot> builder)
        {
            // Chave primária
            builder.HasKey(slot => slot.Id);

            // Propriedade Start
            builder.Property(slot => slot.Start)
                .IsRequired()
                .HasColumnType("datetime");

            // Propriedade End
            builder.Property(slot => slot.End)
                .IsRequired()
                .HasColumnType("datetime");

            // Relacionamento com Staff
            builder.Property(slot => slot.StaffId)
                .IsRequired();

            builder.HasOne<Staff>()
                .WithMany(s => s.AvailabilitySlots)
                .HasForeignKey(slot => slot.StaffId)
                .OnDelete(DeleteBehavior.Cascade);

            // Índices para consultas rápidas
            builder.HasIndex(slot => slot.StaffId);

            // Nome da tabela no banco de dados (opcional)
            builder.ToTable("AvailabilitySlots");
        }
    }
}
