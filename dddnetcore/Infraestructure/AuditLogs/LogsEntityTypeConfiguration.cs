using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDSample1.Domain.AuditLogs;

namespace DDDSample1.Infrastructure.AuditLogs
{
    internal class LogsEntityTypeConfiguration : IEntityTypeConfiguration<Log>
    {
        public void Configure(EntityTypeBuilder<Log> builder)
        {
            builder.HasKey(b => b.Id);

            builder.Property(b => b.Timestamp)
                .IsRequired();

            builder.Property(b => b.LogActionType)
                .IsRequired();

            builder.Property(b => b.LogCategoryType)
                .HasColumnName("Category")
                .IsRequired();

            builder.OwnsOne(b => b.Content, content =>
            {
                content.Property(c => c.Text)
                    .HasColumnName("Content")
                    .IsRequired();
            });
        }
    }
}
