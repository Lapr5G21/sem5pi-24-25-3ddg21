using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.SurgeryRooms;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DDDSample1.Infraestructure.SurgeryRooms
{
    public class SurgeryRoomEntityTypeConfiguration : IEntityTypeConfiguration<SurgeryRoom>
    {
        public void Configure(EntityTypeBuilder<SurgeryRoom> builder)
        {
            builder.HasKey(b => b.Id);
            builder.Property(b => b.RoomCapacity).HasConversion(b => b.Capacity, b => new SurgeryRoomCapacity(b)).IsRequired();
            builder.Property(b => b.MaintenanceSlots).HasConversion(b => b.MaintenanceSlots, b => new SurgeryRoomMaintenanceSlots(b)).IsRequired();
            builder.Property(b => b.Equipment).HasConversion(b => b.Equipment, b => new SurgeryRoomEquipment(b)).IsRequired();
            builder.Property(b => b.Status).HasConversion<string>().IsRequired();
            builder.HasOne(b => b.RoomType).WithMany().HasForeignKey("RoomTypeCode").IsRequired();        }
    }
}