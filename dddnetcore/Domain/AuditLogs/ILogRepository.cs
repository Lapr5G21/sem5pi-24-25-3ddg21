using System.Threading.Tasks;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.AuditLogs
{
    public interface ILogRepository : IRepository<Log, LogId>
    {
        Log LogUpdateOperation(LogCategoryType categoryType, string details);
        Log LogDeleteOperation(LogCategoryType categoryType, string details);
        Log LogDeactivationOperation(LogCategoryType categoryType, string details);
    }
}
