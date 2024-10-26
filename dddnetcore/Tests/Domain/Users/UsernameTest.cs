using Xunit;
using DDDSample1.Domain.Users;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Tests.Domain.Users
{
    public class UsernameTest
    {
        

        [Fact]
        public void Constructor_ShouldCreateUsername_WhenValidStringIsProvided()
        {
            var validUsername = "D20240001@healthcare.com";

            var username = new Username(validUsername);

            Assert.NotNull(username);
            Assert.Equal(validUsername, username.AsString());
        }

        [Fact]
        public void AsString_ShouldReturnUsernameString()
        {
            var validUsername = "D20240001@healthcare.com";
            var username = new Username(validUsername);

            var result = username.AsString();

            Assert.Equal(validUsername, result);
        }

        [Fact]
        public void Equals_ShouldReturnFalse_WhenComparedWithNull()
        {
            var username = new Username("D20240001@healthcare.com");

            var result = username.Equals(null);

            Assert.False(result);
        }

        [Fact]
        public void Equals_ShouldReturnFalse_WhenComparedWithDifferentType()
        {
            var username = new Username("D20240001@healthcare.com");
            var differentType = new object();

            var result = username.Equals(differentType);

            Assert.False(result);
        }

        [Fact]
        public void Equals_ShouldReturnTrue_WhenComparedWithSameUsername()
        {
            var username1 = new Username("D20240001@healthcare.com");
            var username2 = new Username("D20240001@healthcare.com");

            var result = username1.Equals(username2);

            Assert.True(result);
        }

        [Fact]
        public void GetHashCode_ShouldReturnSameHash_WhenUsernamesAreEqual()
        {
            var username1 = new Username("D20240001@healthcare.com");
            var username2 = new Username("D20240001@healthcare.com");

            var hash1 = username1.GetHashCode();
            var hash2 = username2.GetHashCode();

            Assert.Equal(hash1, hash2);
        }

        [Fact]
        public void ToString_ShouldReturnUsernameString()
        {
            var validUsername = "D20240001@healthcare.com";
            var username = new Username(validUsername);

            var result = username.ToString();

            Assert.Equal(validUsername, result);
        }
    }
}
