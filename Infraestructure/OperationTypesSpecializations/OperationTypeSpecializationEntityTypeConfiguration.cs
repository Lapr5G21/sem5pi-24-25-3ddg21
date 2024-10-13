using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDSample1.Domain.OperationTypesSpecializations;

namespace DDDSample1.Infrastructure.OperationTypesSpecializations
{
    internal class OperationTypeSpecializationEntityTypeConfiguration : IEntityTypeConfiguration<OperationTypeSpecialization>
    {
        public void Configure(EntityTypeBuilder<OperationTypeSpecialization> builder)
        {
            // Define o nome da tabela
            builder.ToTable("OperationTypeSpecializations");

            // Define a chave primária
            builder.HasKey(ots => ots.Id);

            // Configura as chaves estrangeiras
            builder.HasOne(ots => ots.OperationType)
                .WithMany(ot => ot.Specializations) 
                .HasForeignKey(ots => ots.Id.OperationTypeId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(ots => ots.Specialization)
                .WithMany(s => s.OperationTypes) 
                .HasForeignKey(ots => ots.Id.SpecializationId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
