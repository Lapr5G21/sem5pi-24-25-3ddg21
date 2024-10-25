using System.Collections.Generic;
using System.Threading.Tasks;

namespace DDDSample1.Domain.Emails
{
    public interface IEmailService
    {
        Task SendEmailAsync(List<string> toEmail, string subject, string body);
    }
}
