using System;
using DDDSample1.Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DDDSample1.Infrastructure.Users
{
    internal class UserEntityTypeConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(b => b.Id);

            builder.Property(b => b.Id)
                .HasConversion(u => u.UsernameString, u => new Username(u))
                .IsRequired();

            builder.Property(b => b.Email)
                .HasConversion(e => e.EmailString, e => new Email(e))
                .IsRequired();
            builder.HasIndex(b => b.Email)
                .IsUnique();

            builder.Property(b => b.Role)
                .HasConversion(
                    r => r.RoleValue.ToString(),
                    r => new Role((RoleType)Enum.Parse(typeof(RoleType), r))
                )
                .IsRequired();

            builder.HasIndex(b => b.Id) 
                .IsUnique();

            builder.Property(b => b.Active)
                .HasColumnName("IsActive")
                .IsRequired();
        }
    }
}
