using Microsoft.EntityFrameworkCore;
using MoneyTransferApi.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", policy => {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

// Auto-create database and seed data for the assessment
using (var scope = app.Services.CreateScope()) {
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    // Note: In production, you'd use db.Database.Migrate(); 
    // EnsureCreated is fine for a quick Docker assessment setup.
    db.Database.EnsureCreated();
    DbInitializer.Initialize(db);
}

app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "MoneyTransferApi v1"));

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();
app.Run();
