using System;
using DDDSample1.Domain.Shared;
using Newtonsoft.Json;

namespace DDDSample1.Domain.Staffs
{
    public class StaffId : EntityId
    {
        [JsonConstructor]
        public StaffId(string value) : base(value)
        {
        }

        public StaffId(Guid value) : base(value.ToString())
        {
        }

        override
        protected object createFromString(string text)
        {
            return text; 
        }

        override
        public string AsString()
        {
            return (string)base.ObjValue;
        }

        public new string Value() => (string)base.ObjValue;
    }
}
