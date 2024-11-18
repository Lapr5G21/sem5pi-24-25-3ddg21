using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.Staffs;
using DDDSample1.Domain.OperationRequests;

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

            builder.Property(b => b.DeadlineDate)
                .HasConversion(
                    v => v.Value,
                    v => new DeadlineDate(v)) 
                .IsRequired();

            builder.Property(b => b.Status)
                   .IsRequired();

            builder.HasOne<OperationType>() 
                   .WithMany()
                   .HasForeignKey(b => b.OperationTypeId);

            builder.Property(b => b.StaffId)
                    .IsRequired();
        }
    }
}
