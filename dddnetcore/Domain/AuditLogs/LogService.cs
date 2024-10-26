using System.Threading.Tasks;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Users;
using System;

namespace DDDSample1.Domain.AuditLogs
{
    public class LogService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogRepository _repo;

        public LogService(IUnitOfWork unitOfWork, ILogRepository repo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
        }

        public async Task<List<LogDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();
            List<LogDto> listDto = list.ConvertAll(log => new LogDto
            {
                LogId = log.Id.AsString(),
                Timestamp = log.Timestamp,
                LogActionType = log.LogActionType.ToString(),
                LogCategoryType = log.LogCategoryType.ToString(),
                LogContent = log.Content.Text
            });

            return listDto;
        }

        public async Task<LogDto> GetByIdAsync(LogId id)
        {
            var log = await this._repo.GetByIdAsync(id);
            
            if (log == null)
                return null;

            return new LogDto
            {
                LogId = log.Id.AsString(),
                Timestamp = log.Timestamp,
                LogActionType = log.LogActionType.ToString(),
                LogCategoryType = log.LogCategoryType.ToString(),
                LogContent = log.Content.Text
            };
        }

        public async Task<LogDto> LogUpdateOperation(LogCategoryType categoryType,string details)
        {
            var log = new Log(
                new LogId(Guid.NewGuid().ToString()),
                LogActionType.UPDATE,
                new LogContent(details),
                categoryType
            );
            await this._repo.AddAsync(log);
            await this._unitOfWork.CommitAsync();
            return new LogDto
            {
                LogId = log.Id.AsString(),
                Timestamp = log.Timestamp,
                LogActionType = log.LogActionType.ToString(),
                LogCategoryType = log.LogCategoryType.ToString(),
                LogContent = log.Content.Text
            };
        }

        public async Task<LogDto> LogDeleteOperation(LogCategoryType categoryType,string details)
        {
            var log = new Log(
                new LogId(Guid.NewGuid().ToString()),
                LogActionType.DELETE,
                new LogContent(details),
                categoryType
            );
            await this._repo.AddAsync(log);
            await this._unitOfWork.CommitAsync();
            return new LogDto
            {
                LogId = log.Id.AsString(),
                Timestamp = log.Timestamp,
                LogActionType = log.LogActionType.ToString(),
                LogCategoryType = log.LogCategoryType.ToString(),
                LogContent = log.Content.Text
            };
        }      

        public async Task<LogDto> LogDeactivationOperation(LogCategoryType categoryType,string details)
        {
            var log = new Log(
                new LogId(Guid.NewGuid().ToString()),
                LogActionType.DEACTIVATION,
                new LogContent(details),
                categoryType
            );
            await this._repo.AddAsync(log);
            await this._unitOfWork.CommitAsync();
            return new LogDto
            {
                LogId = log.Id.AsString(),
                Timestamp = log.Timestamp,
                LogActionType = log.LogActionType.ToString(),
                LogCategoryType = log.LogCategoryType.ToString(),
                LogContent = log.Content.Text
            };
        }        

        public async Task<LogDto> DeleteAsync(LogId id)
        {
            var log = await this._repo.GetByIdAsync(id); 

            if (log == null)
                return null;

            this._repo.Remove(log);
            await this._unitOfWork.CommitAsync();

            return new LogDto
            {
                LogId = log.Id.AsString(),
                Timestamp = log.Timestamp,
                LogActionType = log.LogActionType.ToString(),
                LogCategoryType = log.LogCategoryType.ToString(),
                LogContent = log.Content.Text
            };
        }
    }
}
