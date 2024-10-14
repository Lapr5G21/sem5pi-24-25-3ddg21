using DDDSample1.Domain.OperationTypesSpecializations;
using DDDSample1.Infrastructure.Shared;

namespace DDDSample1.Infrastructure.OperationTypesSpecializations
{
    public class OperationTypeSpecializationRepository : BaseRepository<OperationTypeSpecialization, OperationTypeSpecializationId>, IOperationTypeSpecializationRepository
    {
        public OperationTypeSpecializationRepository(DDDSample1DbContext context) : base(context.OperationTypeSpecializations)
        {
        }
        
    }
}
