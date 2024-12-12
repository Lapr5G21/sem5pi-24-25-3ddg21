using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDSample1.Domain.RoomTypes;

namespace DDDSample1.Infraestructure.RoomTypes
{
    public class RoomTypeEntityTypeConfiguration : IEntityTypeConfiguration<RoomType>
    {
        public void Configure(EntityTypeBuilder<RoomType> builder)
        {
            // Chave primária
            builder.HasKey(b => b.Id);


            builder.Property(b => b.Designation)
                .HasConversion(b => b.Value, b => new RoomTypeDesignation(b))
                .IsRequired();

            builder.HasIndex(b => b.Designation).IsUnique();
    
            builder.Property(b => b.Description)
                .HasConversion(b => b.Value, b => new RoomTypeDescription(b))
                .IsRequired();

            // Mapeamento de RoomTypeSuitability (conversão para booleano)
            builder.Property(b => b.SurgerySuitability)
                .HasConversion(b => b.IsSuitableForSurgery, b => new RoomTypeSurgerySuitability(b))
                .IsRequired();
        }
    }
}
