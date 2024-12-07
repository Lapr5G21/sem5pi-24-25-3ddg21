using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDSample1.Domain.Specializations;

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

            builder.HasIndex(p=> p.SpecializationCode)
                    .IsUnique();
            builder.Property(b => b.SpecializationCode)
                   .HasConversion(b => b.Code, b => new SpecializationCode(b))
                   .IsRequired();   

            builder.Property(b => b.SpecializationDescription)
                   .HasConversion(b => b.Description, b => new SpecializationDescription(b))
                   .IsRequired(false);         
                   
            builder.HasMany(b => b.OperationTypes)
                   .WithOne(b => b.Specialization)
                   .HasForeignKey("SpecializationId")
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
