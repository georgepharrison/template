using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Template.Server;
using Template.Server.Services;

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
            ?? throw new KeyNotFoundException("Google auth configuration not found");

        googleOptions.ClientId = options.ClientId;
        googleOptions.ClientSecret = options.ClientSecret;
        googleOptions.CallbackPath = "/signin-google";
        googleOptions.SignInScheme = IdentityConstants.ExternalScheme;

        // Request profile scope
        googleOptions.Scope.Add("profile");

        // Map the picture claim from Google's response
        googleOptions.ClaimActions.MapJsonKey("picture", "picture");
    });

builder
    .Services.AddIdentityApiEndpoints<IdentityUser>(options =>
    {
        options.SignIn.RequireConfirmedEmail = true;
    })
    .AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.AddSingleton<IEmailSender<IdentityUser>, LoggingEmailSender>();

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
