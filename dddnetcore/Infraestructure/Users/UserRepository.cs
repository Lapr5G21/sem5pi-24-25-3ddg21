using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.Users;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace DDDSample1.Infrastructure.Users
{
    public class UserRepository : BaseRepository<User, Username>, IUserRepository
    {
        private readonly DDDSample1DbContext _context;

        public UserRepository(DDDSample1DbContext context) : base(context.Users)
        {
            _context = context;
        }

        public async Task<User> FindByEmailAsync(Email email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email.Equals(email));
        }

        public async Task<int> GetNextSequentialNumberAsync()
        {
            var userCount = await _context.Users
                .Where(u => !u.Role.ToString().Equals("Patient"))
                .CountAsync();
            return userCount + 1;
        }

        public async Task<User> GetByIdAsync(Username username)
        {
            return await _context.Users.FindAsync(username);
        }
    }
}
