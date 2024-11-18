using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Staffs;

namespace DDDSample1.Domain.Appointments{
    public interface IAppointmentRepository : IRepository<Appointment, AppointmentId> {

    }
}