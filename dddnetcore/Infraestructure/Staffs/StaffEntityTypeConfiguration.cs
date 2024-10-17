using DDDSample1.Domain.Staffs;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DDDSample1.Infrastructure.Staffs
{
    internal class StaffEntityTypeConfiguration : IEntityTypeConfiguration<Staff>
    {
        public void Configure(EntityTypeBuilder<Staff> builder)
        {
            // Definir a chave primária
            builder.HasKey(b => b.StaffId);

            // Configurações para as propriedades
            builder.Property(b => b.StaffFirstName)
                .HasConversion(s => s.FirstNameString, s => new StaffFirstName(s))
                .IsRequired();

            builder.Property(b => b.StaffLastName)
                .HasConversion(s => s.LastNameString, s => new StaffLastName(s))
                .IsRequired();

            builder.Property(b => b.LicenseNumber)
                .HasConversion(l => l.LicenseNumberString, l => new LicenseNumber(l))
                .IsRequired();

            builder.Property(b => b.StaffEmail)
                .HasConversion(e => e.EmailString, e => new StaffEmail(e))
                .IsRequired();

            builder.Property(b => b.StaffPhoneNumber)
                .HasConversion(p => p.PhoneNumberString, p => new StaffPhoneNumber(p))
                .IsRequired();

            builder.Property(b => b.Active)
                .HasColumnName("IsActive")
                .IsRequired();

            // Configuração de relacionamento com Specialization
            builder.HasOne(b => b.Specialization) // Cada Staff tem uma única Specialization
                .WithMany(s => s.Staffs) // Uma Specialization pode ter muitos Staffs
                .HasForeignKey("SpecializationId") // Nome da coluna de chave estrangeira em Staff
                .OnDelete(DeleteBehavior.Cascade) // Comportamento ao deletar uma Specialization
                .IsRequired(); // Se a especialização é obrigatória

            // Configuração de relacionamento com User
            builder.HasOne(b => b.User) // Cada Staff está associado a um User
                .WithOne() // Um User pode ter apenas um Staff
                .HasForeignKey<Staff>("UserId") // Nome da coluna de chave estrangeira em Staff
                .OnDelete(DeleteBehavior.Cascade) // Comportamento ao deletar um User
                .IsRequired(); // Se o User é obrigatório
        }
    }
}
