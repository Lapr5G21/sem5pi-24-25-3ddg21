using System;
using System.Text.RegularExpressions;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients{
public class PatientPhoneNumber : IValueObject
{
    public string PhoneNumber { get; private set; }

    public PatientPhoneNumber(string phoneNumber)
    {
        if (!IsValidPhoneNumber(phoneNumber) || string.IsNullOrWhiteSpace(phoneNumber))
        {
            throw new BusinessRuleValidationException("The phone number introduced is not portuguese or is invalid");
        }
        PhoneNumber = phoneNumber;
    }

    public static bool IsValidPhoneNumber(string phoneNumber)
    {
        string pattern = @"^9[1236]\d{7}$";
        return Regex.IsMatch(phoneNumber, pattern);
    }

    public override string ToString()
    {
        return PhoneNumber;
    }
    }
}
