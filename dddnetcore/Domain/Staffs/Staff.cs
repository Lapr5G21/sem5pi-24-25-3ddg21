using System;
using System.Collections.Generic;
using System.Linq;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Specializations;
using DDDSample1.Domain.Users;
using DDDSample1.Domain.AppointmentsStaffs;

namespace DDDSample1.Domain.Staffs
{
    public class Staff : Entity<StaffId>, IAggregateRoot
    {
        public StaffFirstName StaffFirstName { get; private set; }
        public StaffLastName StaffLastName { get; private set; }
        public StaffFullName StaffFullName { get; private set; }
        public StaffLicenseNumber StaffLicenseNumber { get; private set; }
        public SpecializationId SpecializationId { get; private set; }
        public StaffEmail StaffEmail { get; private set; }
        public StaffPhoneNumber StaffPhoneNumber { get; private set; }
        public List<AvailabilitySlot> AvailabilitySlots { get; private set; } = new List<AvailabilitySlot>();
        public Username UserId { get; private set; }
        public ICollection<AppointmentStaff> AppointmentTeam {get; private set;} = new List<AppointmentStaff>();

        public bool Active { get; private set; }

        private Staff()
        {
            this.Active = true;
        }

        public Staff(StaffId staffId, StaffFirstName staffFirstName, StaffLastName staffLastName, StaffFullName staffFullName, StaffLicenseNumber licenseNumber, SpecializationId specializationId, StaffEmail staffEmail, StaffPhoneNumber staffPhoneNumber, Username userId)
        {
            this.Active = true;
            this.Id = staffId;
            this.StaffFirstName = staffFirstName;
            this.StaffLastName = staffLastName;
            this.StaffFullName = staffFullName;
            this.StaffLicenseNumber = licenseNumber;
            this.SpecializationId = specializationId;
            this.StaffEmail = staffEmail;
            this.StaffPhoneNumber = staffPhoneNumber;
            this.UserId = userId;
        }

        public void ChangeFirstName(StaffFirstName newFirstName)
        {
            if (!this.Active)
                throw new InvalidOperationException("Cannot modify an inactive staff member.");

            this.StaffFirstName = newFirstName ?? throw new ArgumentNullException(nameof(newFirstName));
        }

        public void ChangeLastName(StaffLastName newLastName)
        {
            if (!this.Active)
                throw new InvalidOperationException("Cannot modify an inactive staff member.");

            this.StaffLastName = newLastName ?? throw new ArgumentNullException(nameof(newLastName));
        }

        public void ChangeFullName(StaffFullName newFullName)
        {
            if (!this.Active)
                throw new InvalidOperationException("Cannot modify an inactive staff member.");

            this.StaffFullName = newFullName ?? throw new ArgumentNullException(nameof(newFullName));
        }

        public void ChangeEmail(StaffEmail newEmail)
        {
            if (!this.Active)
                throw new InvalidOperationException("Cannot modify an inactive staff member.");

            this.StaffEmail = newEmail ?? throw new ArgumentNullException(nameof(newEmail));
        }

        public void ChangePhoneNumber(StaffPhoneNumber newPhoneNumber)
        {
            if (!this.Active)
                throw new InvalidOperationException("Cannot modify an inactive staff member.");

            this.StaffPhoneNumber = newPhoneNumber ?? throw new ArgumentNullException(nameof(newPhoneNumber));
        }

        public void ChangeSpecialization(SpecializationId newSpecializationId)
        {
            if (!this.Active)
                throw new InvalidOperationException("Cannot modify an inactive staff member.");

            this.SpecializationId = newSpecializationId ?? throw new ArgumentNullException(nameof(newSpecializationId));
        }


        public AvailabilitySlot AddAvailabilitySlot(DateTime start, DateTime end, StaffId staffId)
        {
            if (!Active)
            {
                throw new InvalidOperationException("Cannot add availability slots to an inactive staff member.");
            }

            var newSlot = new AvailabilitySlot(start, end, staffId);
            AvailabilitySlots.Add(newSlot);

            return newSlot;
        }

public AvailabilitySlot RemoveAvailabilitySlot(String staffId, DateTime start, DateTime end)
{
    // Arredonda as datas para o formato 'yyyy-MM-dd HH:mm:00' (sem segundos e milissegundos)
    var startNormalized = start.AddSeconds(-start.Second).AddMilliseconds(-start.Millisecond);
    var endNormalized = end.AddSeconds(-end.Second).AddMilliseconds(-end.Millisecond);

    Console.WriteLine($"Tentando remover slot para StaffId: {staffId}, Start: {startNormalized.ToString("yyyy-MM-dd HH:mm:00")}, End: {endNormalized.ToString("yyyy-MM-dd HH:mm:00")}");

    // Procurar o slot com base no StaffId e nas datas arredondadas
    var slot = AvailabilitySlots.FirstOrDefault(s =>
        s.StaffId.ToString() == staffId &&
        s.Start == startNormalized &&
        s.End == endNormalized);

    if (slot != null)
    {
        Console.WriteLine($"Slot encontrado: {slot.Id}, StaffId: {slot.StaffId}, Start: {slot.Start}, End: {slot.End}");
        AvailabilitySlots.Remove(slot);
        return slot;
    }

    Console.WriteLine("Nenhum slot encontrado para remover.");
    return null;
}

        public void Deactivate()
        {
            this.Active = false;
        }

        public void Reactivate()
        {
            this.Active = true;
        }

        internal object WithOwner()
        {
            throw new NotImplementedException();
        }

        internal object Property(Func<object, object> value)
        {
            throw new NotImplementedException();
        }
    }
}
