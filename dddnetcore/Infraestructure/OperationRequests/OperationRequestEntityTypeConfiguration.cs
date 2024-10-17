using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDSample1.Domain.OperationRequest;

namespace DDDSample1.Infrastructure.OperationRequests
{
    internal class OperationRequestEntityTypeConfiguration : IEntityTypeConfiguration<OperationRequest>
    {
        public void Configure(EntityTypeBuilder<OperationRequest> builder)
        {
            builder.HasKey(b => b.Id);

            builder.Property(b => b.PriorityLevel)
                   .IsRequired();

            builder.Property(b => b.OperationTypeId)
                   .IsRequired();

            // Adding Value Converter for DeadlineDate
            builder.Property(b => b.DeadlineDate)
                .HasConversion(
                    v => v.Value, // from DeadlineDate to DateTime
                    v => new DeadlineDate(v)) // from DateTime to DeadlineDate
                .IsRequired();

            builder.Property(b => b.Status)
                   .IsRequired();
        }
    }
}
