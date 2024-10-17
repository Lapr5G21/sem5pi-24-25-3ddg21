
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.OperationRequest
{
    public interface IOperationRequestRepository: IRepository<OperationRequest, OperationRequestId>
    {
    }
}