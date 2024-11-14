using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Staffs
{
    public class AvailabilitySlot : Entity<AvailabilitySlotId>
    {
        public StaffId StaffId { get; private set; }
        public DateTime Start { get; private set; }
        public DateTime End { get; private set; }

        private AvailabilitySlot() { }  // Construtor vazio necessário para o EF Core

        public AvailabilitySlot(DateTime start, DateTime end, StaffId staffId)
        {
            Id = new AvailabilitySlotId(Guid.NewGuid());  // Geração do ID do Slot
            Start = start;
            End = end;
            StaffId = staffId ?? throw new ArgumentNullException(nameof(staffId));
        }
    }
}
