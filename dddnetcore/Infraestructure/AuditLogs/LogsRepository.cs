using System;
using System.Threading.Tasks;
using DDDSample1.Domain.AuditLogs;
using DDDSample1.Infrastructure.Shared;

namespace DDDSample1.Infrastructure.AuditLogs
{
    public class LogsRepository : BaseRepository<Log, LogId>, ILogRepository
    {
        private readonly DDDSample1DbContext _context;
        

        public LogsRepository(DDDSample1DbContext context) : base(context.Logs)
        {
            _context = context;
        }

        public Log LogUpdateOperation(LogCategoryType categoryType, string details)
        {
            return new Log(
                new LogId(Guid.NewGuid().ToString()),
                LogActionType.UPDATE,
                new LogContent(details),
                categoryType
            );
        }

        public Log LogDeleteOperation(LogCategoryType categoryType, string details)
        {
            return new Log(
                new LogId(Guid.NewGuid().ToString()),
                LogActionType.DELETE,
                new LogContent(details),
                categoryType
            );
        }

        public Log LogDeactivationOperation(LogCategoryType categoryType, string details)
        {
            return new Log(
                new LogId(Guid.NewGuid().ToString()),
                LogActionType.DEACTIVATION,
                new LogContent(details),
                categoryType);      
        }

        public Log LogActivationOperation(LogCategoryType categoryType, string details)
        {
            return new Log(
                new LogId(Guid.NewGuid().ToString()),
                LogActionType.DEACTIVATION,
                new LogContent(details),
                categoryType);      
        }
    }
}
