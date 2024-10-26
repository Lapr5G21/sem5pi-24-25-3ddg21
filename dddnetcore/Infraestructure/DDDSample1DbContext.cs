using Microsoft.EntityFrameworkCore;
using DDDSample1.Domain.Categories;
using DDDSample1.Domain.Products;
using DDDSample1.Domain.Families;
using DDDSample1.Infrastructure.Categories;
using DDDSample1.Infrastructure.Products;
using DDDSample1.Infrastructure.OperationTypes;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.Specializations;
using DDDSample1.Infrastructure.Specializations;
using DDDSample1.Domain.OperationTypesSpecializations;
using DDDSample1.Infrastructure.OperationTypesSpecializations;
using DDDSample1.Infrastructure.Users;
using DDDSample1.Domain.Users;
using DDDSample1.Domain.OperationRequest;
using DDDSample1.Infrastructure.OperationRequests;
using DDDSample1.Domain.Staffs;
using DDDSample1.Infrastructure.Staffs;
using DDDSample1.Domain.Patients;
using DDDSample1.Infrastructure.Patients;
using DDDSample1.Domain.AuditLogs;
using DDDSample1.Infrastructure.AuditLogs;

namespace DDDSample1.Infrastructure
{
    public class DDDSample1DbContext : DbContext
    {
        public DbSet<Category> Categories { get; set; }

        public DbSet<Product> Products { get; set; }

        public DbSet<Family> Families { get; set; }

        public DbSet<OperationRequest> OperationRequests { get;set; }

        public DbSet<OperationType> OperationTypes { get; set; }

        public DbSet<Specialization> Specializations { get; set; }

        public DbSet<OperationTypeSpecialization> OperationTypeSpecializations { get; set; }

        public DbSet<User> Users { get; set; }
        
        public DbSet<Staff> Staffs { get; internal set; }

        public DbSet<Patient> Patients { get; set; }
        public DbSet<Log> Logs { get; set; }

        public DDDSample1DbContext(DbContextOptions options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new CategoryEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new ProductEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new FamilyEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new OperationRequestEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new OperationTypeEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new SpecializationEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new OperationTypeSpecializationEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new UserEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new StaffEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new PatientEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new LogsEntityTypeConfiguration());
        }
    }
}