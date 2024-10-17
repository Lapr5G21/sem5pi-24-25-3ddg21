using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDSample1.Domain.Specializations;
using DDDSample1.Domain.OperationTypesSpecializations;

namespace DDDSample1.Infrastructure.Specializations
{
    internal class SpecializationEntityTypeConfiguration : IEntityTypeConfiguration<Specialization>
    {
        public void Configure(EntityTypeBuilder<Specialization> builder)
        {
            builder.HasKey(b => b.Id);
            
            builder.Property(b => b.SpecializationName)
                   .HasConversion(b => b.Name, b => new SpecializationName(b))
                   .IsRequired();

            builder.HasMany(b => b.OperationTypes)
                   .WithOne(b => b.Specialization)
                   .HasForeignKey("SpecializationId")
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}