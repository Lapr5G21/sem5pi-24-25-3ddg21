using System;
using DDDSample1.Domain.Specializations;
using DDDSample1.Domain.Staffs;
using DDDSample1.Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DDDSample1.Infrastructure.Staffs
{
    internal class StaffEntityTypeConfiguration : IEntityTypeConfiguration<Staff>
    {
        public void Configure(EntityTypeBuilder<Staff> builder)
        {
            builder.HasKey(b => b.Id);

            builder.Property(b => b.StaffFirstName)
                .HasConversion(s => s.FirstNameString, s => new StaffFirstName(s))
                .IsRequired();

            builder.Property(b => b.StaffLastName)
                .HasConversion(s => s.LastNameString, s => new StaffLastName(s))
                .IsRequired();

            builder.Property(b => b.StaffFullName)
                .HasConversion(s => s.FullNameString, s => new StaffFullName(s))
                .IsRequired();
                
            builder.Property(b => b.StaffLicenseNumber)
                .HasConversion(l => l.LicenseNumberString, l => new StaffLicenseNumber(l))
                .IsRequired();

            builder.HasIndex(b => b.StaffLicenseNumber)
                .IsUnique();

            builder.Property(b => b.StaffEmail)
                .HasConversion(e => e.EmailString, e => new StaffEmail(e))
                .IsRequired();

            builder.HasIndex(b => b.StaffEmail)
                .IsUnique();

            builder.Property(b => b.StaffPhoneNumber)
                .HasConversion(p => p.PhoneNumberString, p => new StaffPhoneNumber(p))
                .IsRequired();

            builder.HasIndex(b => b.StaffPhoneNumber)
                .IsUnique();

            builder.Property(b => b.Active)
                .HasColumnName("IsActive")
                .IsRequired();
            
            builder.Property(b => b.StaffAvailabilitySlots)
                .HasConversion(p => p.Slots, p => new StaffAvailabilitySlots(p))
                .HasColumnName("Slots")
                .IsRequired();

            builder.HasOne<Specialization>()
                .WithMany()
                .HasForeignKey(b => b.SpecializationId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();

            builder.HasOne<User>()
                .WithOne()
                .HasForeignKey<Staff>(b => b.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();
        }
    }
}
