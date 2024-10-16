using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Staffs
{
    public class StaffEmail : IValueObject
{
    public string EmailString { get; private set; }

    public StaffEmail(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new BusinessRuleValidationException("Email cannot be empty.");
        }

        if (!IsValidEmail(value))
        {
            throw new BusinessRuleValidationException("Invalid email format.");
        }

        this.EmailString = value;
    }

    private bool IsValidEmail(string email)
    {
        var emailRegex = new Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$");
        return emailRegex.IsMatch(email);
    }

    public override string ToString()
    {
        return EmailString;
    }
}
}