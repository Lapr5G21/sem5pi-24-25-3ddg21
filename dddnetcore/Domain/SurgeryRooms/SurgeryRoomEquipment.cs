using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.SurgeryRooms
{
    public class SurgeryRoomEquipment : IValueObject {
    
        public string Equipment {get; private set;}

        public SurgeryRoomEquipment(string Equipment) {
            if (string.IsNullOrEmpty(Equipment))
                throw new BusinessRuleValidationException("Assigned Equipment cannot be null or empty");
            this.Equipment = Equipment;
        }

        public override bool Equals(object obj){
            if (obj == null || GetType() != obj.GetType())
                return false;

            return Equipment.Equals(((SurgeryRoomEquipment)obj).Equipment);
        }

        
        public override int GetHashCode()
        {
            return Equipment.GetHashCode();
        }
    }
}