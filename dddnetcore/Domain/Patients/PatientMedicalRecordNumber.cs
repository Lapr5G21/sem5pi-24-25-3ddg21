using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using Newtonsoft.Json;


namespace DDDSample1.Domain.Patients
{
    public class PatientMedicalRecordNumber : EntityId
    {
        public PatientMedicalRecordNumber(string value) : base(value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                throw new ArgumentException("Invalid Medical Record Number format.");
            }
        }

        protected override object createFromString(string text)
        {
            return text;
        }

        public override string AsString()
        {
            return (string)this.ObjValue;
        }

        public static string GenerateNewRecordNumber(DateTime registrationDate, int sequentialNumber)
        {
            string year = registrationDate.ToString("yyyy");
            string month = registrationDate.ToString("MM");
            string seqNum = sequentialNumber.ToString("D6");
            return year + month + seqNum;
        }
    }
}