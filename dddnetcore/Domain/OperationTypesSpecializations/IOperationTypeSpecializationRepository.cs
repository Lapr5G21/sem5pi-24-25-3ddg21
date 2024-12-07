
using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Specializations;

namespace DDDSample1.Domain.OperationTypesSpecializations
{
    public interface IOperationTypeSpecializationRepository: IRepository<OperationTypeSpecialization, OperationTypeSpecializationId>
    {
        public Task<IEnumerable<OperationTypeSpecialization>> CheckSpecializationIsAtributtedToOpType(Specialization specialization);

    }
}