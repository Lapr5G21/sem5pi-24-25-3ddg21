using System;
using System.Text.Json.Serialization;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Staffs
{
    public class AvailabilitySlotId : EntityId
    {
        public AvailabilitySlotId(Guid value) : base(value.ToString())
        {
        }
        [JsonConstructor]
        public AvailabilitySlotId(string value) : base(value)
        {
        }

        public override string AsString()
        {
            return (string)base.ObjValue;
        }

        protected override object createFromString(string text)
        {
            return text; 
        }

        public new string Value() => (string)base.ObjValue;
    }
}
