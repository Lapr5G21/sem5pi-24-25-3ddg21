using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.OperationTypesSpecializations;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace DDDSample1.Infrastructure.OperationTypes
{
    public class OperationTypeRepository : BaseRepository<OperationType, OperationTypeId>, IOperationTypeRepository
    {
        private readonly DDDSample1DbContext _context;
    
        public OperationTypeRepository(DDDSample1DbContext context):base(context.OperationTypes)
        {
            _context=context;
        }
        public async Task<List<OperationType>> GetOperationTypesAsync()
        {
            var query = _context.OperationTypes.AsQueryable();

            query = query.Include(o => o.Specializations)
                        .ThenInclude(ots => ots.Specialization);

            return await query.ToListAsync();
}
           public async Task<IEnumerable<OperationType>> SearchAsync(SearchOperationTypeDto searchDto)
        {
            var query = _context.Set<OperationType>().AsQueryable();

            if (!string.IsNullOrEmpty(searchDto.Name))
            {
                query = query.Where(o => o.Name.Name.Contains(searchDto.Name, StringComparison.OrdinalIgnoreCase)); 
            }

            if (searchDto.SpecializationId != Guid.Empty)
            {
                var operationTypeIds = await _context.Set<OperationTypeSpecialization>()
                    .Where(ots => ots.Specialization.Id.AsGuid() == searchDto.SpecializationId)
                    .Select(ots => ots.OperationType.Id)
                    .ToListAsync();

                query = query.Where(o => operationTypeIds.Contains(o.Id));
            }

            if (searchDto.IsActive.HasValue)
            {
                query = query.Where(o => o.IsActive == searchDto.IsActive.Value);
            }

            return await query.ToListAsync();
        }

    }
}