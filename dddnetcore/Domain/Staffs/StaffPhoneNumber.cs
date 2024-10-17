using System;
using System.Text.RegularExpressions;
using Microsoft.IdentityModel.Tokens;

namespace DDDSample1.Domain.Staffs{
public class StaffPhoneNumber
{
    public string PhoneNumberString { get; private set; }

    public StaffPhoneNumber(string phoneNumber)
    {
        if (!IsValidPhoneNumber(phoneNumber) || string.IsNullOrWhiteSpace(phoneNumber))
        {
            throw new ArgumentException("The phone number introduced is not portuguese or is invalid");
        }
        PhoneNumberString = phoneNumber;
    }

    public static bool IsValidPhoneNumber(string phoneNumber)
    {
        string pattern = @"^9[1236]\d{7}$";
        return Regex.IsMatch(phoneNumber, pattern);
    }
}
}
