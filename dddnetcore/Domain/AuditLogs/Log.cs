using System;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Users;

namespace DDDSample1.Domain.AuditLogs
{
    public class Log : Entity<LogId>, IAggregateRoot
    {
        public DateTime Timestamp { get; private set; }
        public LogActionType LogActionType { get; private set; }
        public LogContent Content { get; private set; }
        public LogCategoryType LogCategoryType{ get; private set; }

        public Log(LogId logId, LogActionType actionType, LogContent details,LogCategoryType logCategoryType)
        {
            Id = logId;
            Timestamp = DateTime.UtcNow;
            LogActionType = actionType;
            LogCategoryType= logCategoryType;
            Content = details;
        }

        private Log() { }
    }
}