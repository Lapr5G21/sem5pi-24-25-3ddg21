using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Users
{
    public class Username : EntityId
    {
        public string UsernameString { get; private set; }

        protected Username() : base(string.Empty) { }

        public Username(string username) : base(username)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                throw new BusinessRuleValidationException("Username cannot be null or empty.");
            }

            UsernameString = username;
        }

        protected override Object createFromString(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                throw new BusinessRuleValidationException("Cannot create Username from an empty string.");

            return text;
        }

        public override string AsString()
        {
            return UsernameString;
        }

        public override bool Equals(object obj)
        {
            if (obj == null || obj.GetType() != this.GetType())
                return false;

            var other = (Username)obj;
            return UsernameString == other.UsernameString;
        }

        public override int GetHashCode()
        {
            return UsernameString.GetHashCode();
        }

        public override string ToString()
        {
            return UsernameString;
        }
    }
}
