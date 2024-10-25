using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using DDDSample1.Domain.Emails;
using Microsoft.Extensions.Configuration;

namespace DDDSample1.Infrastructure.Emails
{
    public class EmailService : IEmailService
    {
        private readonly string _smtpServer;
        private readonly int _smtpPort;
        private readonly string _smtpUsername;
        private readonly string _smtpPassword;
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration=configuration;
            _smtpServer = _configuration["EmailService:SmtpServer"];
            _smtpPort = int.Parse(_configuration["EmailService:SmtpPort"]); 
            _smtpUsername = _configuration["EmailService:SmtpEmail"];
            _smtpPassword = _configuration["EmailService:SmtpPassword"];
        }

       public async Task SendEmailAsync(List<string> to, string subject, string body)
        {
            using (var client = new SmtpClient(_smtpServer, _smtpPort))
            {
                client.UseDefaultCredentials = false;
                client.Credentials = new NetworkCredential(_smtpUsername, _smtpPassword);
                client.EnableSsl = true;

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(_smtpUsername),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true,
                };

                foreach (var recipient in to){
                    mailMessage.To.Add(recipient);
                }

                await client.SendMailAsync(mailMessage);
            }
        }
    }
}
