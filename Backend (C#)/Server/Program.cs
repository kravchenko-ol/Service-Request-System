using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Server.Data;
using Server.Models;
using Server.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter()
        );
    });
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddScoped<IRequestService, ServiceRequest>();
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<ICommentService, CommentService>();
builder.Services.AddScoped<IPasswordHasher<Account>, PasswordHasher<Account>>();
builder.Services.AddScoped<IDtoAccountServices, DtoAccountServices>();
builder.Services.AddScoped<IDtoRequestServices, DtoRequestServices>();
builder.Services.AddScoped<ITicketService, TicketService>();
builder.Services.AddScoped<IDtoTicketService, DtoTicketService>();
builder.Services.AddScoped<IDtoCommentServices, DtoCommentService>();
builder.Services.AddScoped<IDtoLoginService, LoginService>();
builder.Services.AddScoped<IJwtServices, JwtServices>();
builder.Services.AddSignalR();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes
                (
                    builder.Configuration["Jwt:Key"] ?? throw new Exception("Jwt:Key not found")
                )
            ),
            ValidateLifetime = true,
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlite("Data Source=server.db");
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy", policy =>
    {
        policy
        .WithOrigins("http://localhost:5173")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("ReactPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHub<UpdateHubs>("/hubs/update");
app.Run();
