using DDDSample1.Domain.AuditLogs;
using DDDSample1.Domain.Shared;
using System;
using Xunit;

namespace DDDSample1.Tests.Domain.AuditLogs
{
    public class LogContentTests
    {
        [Fact]
        public void TestConstructorWithValidArguments()
        {
            var validText = "Log update";

            var logContent = new LogContent(validText);

            Assert.Equal(validText, logContent.Text);
        }

        [Fact]
        public void Constructor_ShouldThrowException_WhenTextIsEmpty()
        {
            var invalidText = "";

            var exception = Assert.Throws<BusinessRuleValidationException>(() => new LogContent(invalidText));
            Assert.Equal("Text cannot be empty or whitespace.", exception.Message);
        }
    }
}