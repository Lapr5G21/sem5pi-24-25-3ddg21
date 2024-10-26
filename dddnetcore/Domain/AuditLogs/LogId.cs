using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.AuditLogs
{
    public class LogId : EntityId
    {

        public LogId(String value):base(value)
        {

        }

        override
        protected Object createFromString(string text){
            return text;
        }

        override
        public String AsString(){
            return (String) base.Value;
        }
    }
}