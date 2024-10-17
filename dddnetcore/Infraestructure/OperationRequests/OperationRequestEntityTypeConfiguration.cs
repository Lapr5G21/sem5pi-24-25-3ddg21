using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDSample1.Domain.OperationRequest;

namespace DDDSample1.Infrastructure.OperationRequests
{


internal class OperationRequestEntityTypeConfiguration: IEntityTypeConfiguration<OperationRequest>{

public void Configure(EntityTypeBuilder<OperationRequest> builder)
{

builder.HasKey(b => b.Id);

builder.Property(b => b.PriorityLevel);

builder.Property(b => b.OperationType);

builder.Property(b => b.DeadlineDate );

builder.Property(b => b.Status);

}
}










}