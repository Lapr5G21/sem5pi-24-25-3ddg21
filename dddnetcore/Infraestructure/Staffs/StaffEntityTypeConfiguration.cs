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
            builder.HasKey(b => b.StaffId);

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

            builder.Property(b => b.StaffEmail)
                .HasConversion(e => e.EmailString, e => new StaffEmail(e))
                .IsRequired();

            builder.Property(b => b.StaffPhoneNumber)
                .HasConversion(p => p.PhoneNumberString, p => new StaffPhoneNumber(p))
                .IsRequired();

            builder.Property(b => b.Active)
                .HasColumnName("IsActive")
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
                .IsRequired(false);

            builder.OwnsOne(s => s.StaffAvailabilitySlots, a =>
            {
                a.OwnsMany(s => s.Slots, slot =>
                {
                    slot.WithOwner().HasForeignKey("StaffId");
                    slot.Property<DateTime>("Start");
                    slot.Property<DateTime>("End");
                    slot.HasKey("StaffId", "Start", "End");
                });
            });
        }
    }
}
