
using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.OperationTypes
{
    public interface IOperationTypeRepository: IRepository<OperationType, OperationTypeId>
    {
        public Task<IEnumerable<OperationType>> SearchAsync(SearchOperationTypeDto searchDto);
    }
}