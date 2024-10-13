
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Specializations
{
    public interface ISpecializationRepository: IRepository<Specialization, SpecializationId>
    {
    }
}