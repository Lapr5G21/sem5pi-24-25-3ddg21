using System;
using DDDSample1.Domain.AuditLogs;
using DDDSample1.Domain.Shared;
using Moq;
using Xunit;

namespace DDDSample1.Tests.Domain.AuditLogs
{
    public class LogTests
    {
        [Fact]
        public void TestConstructorWithValidArguments()
        {
            var logId = new LogId(Guid.NewGuid().ToString());
            var actionType = LogActionType.DELETE;
            var content = new LogContent("User deletion action");
            var categoryType = LogCategoryType.USER;

            var log = new Log(logId, actionType, content, categoryType);

            Assert.Equal(logId, log.Id);
            Assert.Equal(actionType, log.LogActionType);
            Assert.Equal(content, log.Content);
            Assert.Equal(categoryType, log.LogCategoryType);
            Assert.Equal(DateTime.UtcNow, log.Timestamp, TimeSpan.FromSeconds(1)); 
        }
    }
}
