using System;

namespace DDDSample1.Domain.AuditLogs
{
    public class LogDto
    {
        public string LogId { get; set; }
        public DateTime Timestamp { get; set; }
        public string LogActionType { get; set; } 
        public string LogCategoryType { get; set; }
        public string LogContent { get; set; }
    }
}