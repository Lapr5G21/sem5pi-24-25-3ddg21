using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.AuditLogs{
public class LogContent
{
    public string Text { get; }

    public LogContent(string text)
    {
        {
            if (string.IsNullOrWhiteSpace(text))
                throw new BusinessRuleValidationException("Text cannot be empty or whitespace.");
        }
        this.Text=text;
        }
    }
}