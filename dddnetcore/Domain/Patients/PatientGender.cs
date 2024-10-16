using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients
{
    public enum Gender
    {
        Male,
        Female,
        RatherNotSay
    }

    public class PatientGender : IValueObject
    {
        public Gender GenderValue { get; private set; }

        public PatientGender(Gender gender)
        {
            this.GenderValue = gender;
        }

        public override string ToString()
        {
            return GenderValue.ToString();
        }

        public override bool Equals(object obj)
        {
            if (obj == null || obj.GetType() != typeof(PatientGender))
                return false;

            PatientGender other = (PatientGender)obj;
            return GenderValue == other.GenderValue;
        }

        public override int GetHashCode()
        {
            return GenderValue.GetHashCode();
        }
    }
}
