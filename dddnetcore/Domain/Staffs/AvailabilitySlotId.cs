using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Staffs
{
    public class AvailabilitySlotId : EntityId
    {
        public AvailabilitySlotId(Guid value) : base(value) { }

        public override string AsString()
        {
            throw new NotImplementedException();
        }

        protected override object createFromString(string text)
        {
            throw new NotImplementedException();
        }
    }
}
