using System;
using System.Text.RegularExpressions;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients{
public class PatientEmergencyContact : IValueObject
{
    public string EmergencyContact { get; private set; }

    public PatientEmergencyContact(string emergencyContact)
    {
        if (!IsValidEmergencyContact(emergencyContact) || string.IsNullOrWhiteSpace(emergencyContact))
        {
            throw new BusinessRuleValidationException("The emergency contact introduced is not portuguese or it´s invalid");
        }
        EmergencyContact = emergencyContact;
    }

    public static bool IsValidEmergencyContact(string emergencyContact)
    {
        string pattern = @"^9[1236]\d{7}$";
        return Regex.IsMatch(emergencyContact, pattern);
    }

    public override string ToString()
    {
        return EmergencyContact;
    }
}
}
