using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using DDDSample1.Infrastructure;
using DDDSample1.Infrastructure.Categories;
using DDDSample1.Infrastructure.Products;
using DDDSample1.Infrastructure.Families;
using DDDSample1.Infrastructure.OperationTypes;
using DDDSample1.Infrastructure.Specializations; 
using DDDSample1.Infrastructure.OperationTypesSpecializations;
using DDDSample1.Infrastructure.Users;
using DDDSample1.Infrastructure.Shared;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Categories;
using DDDSample1.Domain.Products;
using DDDSample1.Domain.Families;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.Specializations;
using DDDSample1.Domain.OperationTypesSpecializations;
using DDDSample1.Domain.OperationRequest;
using DDDSample1.Domain.Users;
using DDDSample1.Infrastructure.OperationRequests;
using DDDSample1.Users;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using DDDSample1.Domain.Authentication;
using DDDSample1.Domain.Staffs;
using DDDSample1.Infrastructure.Staffs;


namespace DDDSample1
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
public void ConfigureServices(IServiceCollection services)
{
    services.AddDbContext<DDDSample1DbContext>(opt =>
        opt.UseInMemoryDatabase("DDDSample1DB")
        .ReplaceService<IValueConverterSelector, StronglyEntityIdValueConverterSelector>());

    ConfigureMyServices(services);

    services.AddAuthentication(options => {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options => {
        options.Authority = $"https://{Configuration["Auth0:Domain"]}/";  
        options.Audience = Configuration["Auth0:Audience"];              
    });

    services.AddAuthorization(options =>
    {
        options.AddPolicy("read:messages", policy =>
            policy.Requirements.Add(new HasScopeRequirement("read:messages", $"https://{Configuration["Auth0:Domain"]}/")));

        options.AddPolicy("BackofficeRole", policy =>
            policy.RequireClaim($"{Configuration["Auth0:NameSpace"]}/roles", "Admin", "Doctor", "Nurse", "Technician"));
        options.AddPolicy("AdminRole", policy =>
            policy.RequireClaim($"{Configuration["Auth0:NameSpace"]}/roles", "Admin"));
        options.AddPolicy("DoctorRole", policy =>
            policy.RequireClaim($"{Configuration["Auth0:NameSpace"]}/roles", "Doctor"));
        options.AddPolicy("NurseRole", policy =>
            policy.RequireClaim($"{Configuration["Auth0:NameSpace"]}/roles", "Nurse"));
        options.AddPolicy("TechnicianRole", policy =>
            policy.RequireClaim($"{Configuration["Auth0:NameSpace"]}/roles", "Technician"));
        options.AddPolicy("PatientRole", policy =>
            policy.RequireClaim($"{Configuration["Auth0:NameSpace"]}/roles", "Patient"));
    });

    services.AddControllers().AddNewtonsoftJson();
}


        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }

        public void ConfigureMyServices(IServiceCollection services)
        {
            // Registro de serviços e repositórios existentes
            services.AddTransient<IUnitOfWork, UnitOfWork>();

            services.AddTransient<ICategoryRepository, CategoryRepository>();
            services.AddTransient<CategoryService>();

            services.AddTransient<IProductRepository, ProductRepository>();
            services.AddTransient<ProductService>();

            services.AddTransient<IFamilyRepository, FamilyRepository>();
            services.AddTransient<FamilyService>();

            // Novos serviços e repositórios
            services.AddTransient<IOperationTypeRepository, OperationTypeRepository>();
            services.AddTransient<OperationTypeService>();

            services.AddTransient<ISpecializationRepository, SpecializationRepository>();
            services.AddTransient<SpecializationService>();

            services.AddTransient<IOperationTypeSpecializationRepository, OperationTypeSpecializationRepository>();
            
            services.AddTransient<IOperationRequestRepository, OperationRequestRepository>();
            services.AddTransient<OperationRequestService>();

            services.AddTransient<IUserRepository, UserRepository>();
            services.AddTransient<UserService>();

            services.AddTransient<IStaffRepository, StaffRepository>();
            services.AddTransient<StaffService>();
        }
    }
}
