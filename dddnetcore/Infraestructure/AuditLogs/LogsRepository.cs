using DDDSample1.Domain.Logs;
using DDDSample1.Infrastructure.Shared;

namespace DDDSample1.Infrastructure.Logs
{
    public class LogsRepository : BaseRepository<Log, LogId>, ILogRepository
    {
    
        public LogsRepository(DDDSample1DbContext context):base(context.Logs)
        {
           
        }

    }
}