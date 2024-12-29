using System;
using System.Buffers;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Infrastructure.Shared;

namespace DDDSample1.Infrastructure.OperationRequests
{
    public class OperationRequestRepository : BaseRepository<OperationRequest, OperationRequestId>, IOperationRequestRepository
    {

        private readonly DDDSample1DbContext _context;
    
        public OperationRequestRepository(DDDSample1DbContext context):base(context.OperationRequests)
        {
            _context = context;
        }

        public async Task<OperationRequest> UpdateAsync(OperationRequest operationRequest)
        {
            _context.OperationRequests.Update(operationRequest);
            
            await _context.SaveChangesAsync();

            return operationRequest;
        }
           
        }

    }