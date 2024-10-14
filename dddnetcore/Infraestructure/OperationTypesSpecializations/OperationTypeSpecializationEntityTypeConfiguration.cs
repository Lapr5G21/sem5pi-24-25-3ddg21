using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDSample1.Domain.OperationTypesSpecializations;
using DDDSample1.Domain.Specializations;
using DDDSample1.Domain.OperationTypes;
namespace DDDSample1.Infrastructure.OperationTypesSpecializations
{
    internal class OperationTypeSpecializationEntityTypeConfiguration: IEntityTypeConfiguration<OperationTypeSpecialization>{

         public void Configure(EntityTypeBuilder<OperationTypeSpecialization> builder)
        {
            // cf. https://www.entityframeworktutorial.net/efcore/fluent-api-in-entity-framework-core.aspx
            
            //builder.ToTable("Categories", SchemaNames.DDDSample1);
            builder.HasKey(b => b.Id);
            //builder.Property<bool>("_active").HasColumnName("Active");

            builder.HasOne<OperationType>(b => b.OperationType).WithMany(b => b.Specializations).HasForeignKey("OperationTypeId")
                .OnDelete(DeleteBehavior.Cascade); 

            builder.HasOne<Specialization>(b => b.Specialization).WithMany(b => b.OperationTypes).HasForeignKey("SpecializationId").OnDelete(DeleteBehavior.Cascade); 

            builder.Property(b => b.NumberOfStaff).HasConversion(b => b.Number, b=> new NumberOfStaff(b)).IsRequired();

        }
    }
}