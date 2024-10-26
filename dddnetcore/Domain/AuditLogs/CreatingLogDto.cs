namespace DDDSample1.Domain.AuditLogs
{
    public class CreatingLogDto
    {
        public string LogActionType { get; set; } 
        public string LogCategoryType { get; set; }
        public string LogContent { get; set; }
    }
}