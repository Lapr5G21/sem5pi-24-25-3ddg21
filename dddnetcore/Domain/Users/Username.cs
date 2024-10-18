using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Users
{
    public class Username : EntityId
    {
        // Propriedade que armazena o valor do nome de usuário
        public string UsernameString { get; private set; }

        // Construtor sem parâmetros necessário para o Entity Framework
        protected Username() : base(string.Empty) { }

        // Construtor que recebe o valor do nome de usuário
        public Username(string username) : base(username)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                throw new BusinessRuleValidationException("Username cannot be null or empty.");
            }

            UsernameString = username;
        }

        // Implementação do método createFromString exigido pela classe EntityId
        protected override Object createFromString(string text)
        {
            // Verifica se o texto é válido antes de criar uma nova instância
            if (string.IsNullOrWhiteSpace(text))
                throw new BusinessRuleValidationException("Cannot create Username from an empty string.");

            // Retornar apenas o texto ao invés de criar uma nova instância
            return text; // Alterado para retornar o texto
        }

        // Implementação para garantir que o Username seja comparado por seu valor
        public override string AsString()
        {
            return UsernameString;
        }

        // Sobrescrita de Equals e GetHashCode para garantir a comparação correta
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
