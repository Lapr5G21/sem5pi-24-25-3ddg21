using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.OperationRequests
{
    public interface IOperationRequestRepository: IRepository<OperationRequest, OperationRequestId>
    {
        Task<OperationRequest> UpdateAsync(OperationRequest operationRequest);
    }
}