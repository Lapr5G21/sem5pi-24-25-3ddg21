using System.Threading.Tasks;

namespace DDDSample1.Domain.Emails
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string body);
    }
}
