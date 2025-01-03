using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.OperationTypesSpecializations;
using DDDSample1.Domain.Specializations;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace DDDSample1.Infrastructure.OperationTypesSpecializations
{
    public class OperationTypeSpecializationRepository : BaseRepository<OperationTypeSpecialization, OperationTypeSpecializationId>, IOperationTypeSpecializationRepository
    {

        private readonly DDDSample1DbContext _context;
        public OperationTypeSpecializationRepository(DDDSample1DbContext context) : base(context.OperationTypeSpecializations)
        {
            _context = context;
        }
            public async Task<IEnumerable<OperationTypeSpecialization>> CheckSpecializationIsAtributtedToOpType(Specialization specialization)
        {
            return await _context.OperationTypeSpecializations.Where(op => op.Specialization == specialization).ToListAsync();

        }

        public async Task<List<OperationTypeSpecialization>> GetSpecializationsByOperationTypeAsync(OperationTypeId operationTypeId)
        {
            return await _context.OperationTypeSpecializations
                .Include(ots => ots.Specialization) // Carregar os detalhes da especialização
                .Where(ots => ots.OperationType.Id == operationTypeId) // Filtrar pelo OperationType
                .ToListAsync();
}

        }
        
    }
