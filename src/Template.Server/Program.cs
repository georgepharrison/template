using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Template.Server;

var builder = WebApplication.CreateBuilder(args);

builder.AddNpgsqlDbContext<ApplicationDbContext>("postgresdb");

builder.AddServiceDefaults();

builder
    .Services.AddProblemDetails()
    .AddOpenApi()
    .AddAuthorization()
    .AddAuthentication()
    .AddGoogle(googleOptions =>
    {
        GoogleOptions options =
            builder.Configuration.GetSection("Authentication:Google").Get<GoogleOptions>()
            ?? throw new KeyNotFoundException("??");

        googleOptions.ClientId = options.ClientId;
        googleOptions.ClientSecret = options.ClientSecret;
        googleOptions.CallbackPath = "/signin-google";
        googleOptions.SignInScheme = IdentityConstants.ExternalScheme;
    });

builder
    .Services.AddIdentityApiEndpoints<IdentityUser>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

var app = builder.Build();

app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseAuthentication();
app.UseAuthorization();

app.UseFileServer();

app.MapDefaultEndpoints();

app.MapAuthEndpoints();

using var scope = app.Services.CreateScope();
var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
await dbContext.Database.MigrateAsync();

app.Run();
