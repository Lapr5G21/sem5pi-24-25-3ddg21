using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDSample1.Domain.OperationRequest;
using DDDSample1.Domain.OperationTypes;

namespace DDDSample1.Infrastructure.OperationRequests
{
    internal class OperationRequestEntityTypeConfiguration : IEntityTypeConfiguration<OperationRequest>
    {
        public void Configure(EntityTypeBuilder<OperationRequest> builder)
        {
            // Define a chave primária
            builder.HasKey(b => b.Id);

            // Define as propriedades obrigatórias
            builder.Property(b => b.PriorityLevel)
                   .IsRequired();

            builder.Property(b => b.OperationTypeId)
                   .IsRequired();

            // Adiciona um conversor de valor para DeadlineDate
            builder.Property(b => b.DeadlineDate)
                .HasConversion(
                    v => v.Value, // de DeadlineDate para DateTime
                    v => new DeadlineDate(v)) // de DateTime para DeadlineDate
                .IsRequired();

            builder.Property(b => b.Status)
                   .IsRequired();

            builder.HasOne<OperationType>() 
                   .WithMany()
                   .HasForeignKey(b => b.OperationTypeId);
        }
    }
}
