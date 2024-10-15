using DDDSample1.Domain.Shared;
using System.Collections.Generic;

namespace DDDSample1.Domain.Users
{
    public class Username : EntityId
    {
        public string UsernameString { get; private set; }

        public Username(string value) : base(value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                throw new BusinessRuleValidationException("Username cannot be empty.");
            }
            this.UsernameString = value;
        }

        protected IEnumerable<object> GetEqualityComponents()
        {
            yield return UsernameString;
        }

        public override string ToString() => UsernameString;

        protected override object createFromString(string text)
        {
            throw new System.NotImplementedException();
        }

        public override string AsString()
        {
            throw new System.NotImplementedException();
        }
    }
}