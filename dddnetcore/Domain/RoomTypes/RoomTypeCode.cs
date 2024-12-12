using System;
using System.Text.RegularExpressions;
using System.Text.Json.Serialization;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.RoomTypes
{
    public class RoomTypeCode : EntityId
    {
        public string Id { get; private set; }

        private static readonly Regex CodeRegex = new Regex("^[a-zA-Z0-9-]{8}$");

        [JsonConstructor]
        public RoomTypeCode(string value) : base(value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Room code cannot be null or empty!");

            if (!CodeRegex.IsMatch(value))
                throw new BusinessRuleValidationException("Room code must be exactly 8 characters long and can only contain letters, numbers, and dashes ('-').");

            this.Id = value;
        }

        protected override object createFromString(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                throw new BusinessRuleValidationException("Room code cannot be null or empty!");

            if (!CodeRegex.IsMatch(text))
                throw new BusinessRuleValidationException("Room code must be exactly 8 characters long and can only contain letters, numbers, and dashes ('-').");

            return text;
        }

        public override string AsString()
        {
            return Id;
        }

        public override bool Equals(object obj)
        {
            if (obj == null || GetType() != obj.GetType())
                return false;

            return Id.Equals(((RoomTypeCode)obj).Id);
        }

        public override int GetHashCode()
        {
            return Id.GetHashCode();
        }
    }
}
