
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.AuditLogs
{
    public interface ILogRepository: IRepository<Log, LogId>
    {
    }
}