using DDDSample1.Domain.OperationRequest;
using DDDSample1.Infrastructure.Shared;

namespace DDDSample1.Infrastructure.OperationRequests
{
    public class OperationRequestRepository : BaseRepository<OperationRequest, OperationRequestId>, IOperationRequestRepository
    {
    
        public OperationRequestRepository(DDDSample1DbContext context):base(context.OperationRequests)
        {
           
        }

    }
}