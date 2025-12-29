using System.Net;
using Microsoft.AspNetCore.Identity;

namespace Template.Server.Services;

public class LoggingEmailSender(ILogger<LoggingEmailSender> logger, IConfiguration configuration)
    : IEmailSender<IdentityUser>
{
    private readonly ILogger<LoggingEmailSender> _logger = logger;
    private readonly string _frontendUrl = configuration["FrontendUrl"] ?? "http://localhost:5173";

    public Task SendConfirmationLinkAsync(IdentityUser user, string email, string confirmationLink)
    {
        var decodedLink = WebUtility.HtmlDecode(confirmationLink);
        var uri = new Uri(decodedLink);
        var frontendLink = $"{_frontendUrl}/confirm-email{uri.Query}";

        _logger.ConfirmationEmailSent(email, frontendLink);
        return Task.CompletedTask;
    }

    public Task SendPasswordResetLinkAsync(IdentityUser user, string email, string resetLink)
    {
        var decodedLink = WebUtility.HtmlDecode(resetLink);
        var uri = new Uri(decodedLink);
        var frontendLink = $"{_frontendUrl}/reset-password{uri.Query}";

        _logger.PasswordResetEmailSent(email, frontendLink);
        return Task.CompletedTask;
    }

    public Task SendPasswordResetCodeAsync(IdentityUser user, string email, string resetCode)
    {
        _logger.PasswordResetCodeSent(email, resetCode);
        return Task.CompletedTask;
    }
}

internal static partial class LoggerExtensions
{
    [LoggerMessage(
        Level = LogLevel.Information,
        Message = "📧 Confirmation email for {Email}:\n{Link}"
    )]
    public static partial void ConfirmationEmailSent(
        this ILogger<LoggingEmailSender> logger,
        string email,
        string link
    );

    [LoggerMessage(
        Level = LogLevel.Information,
        Message = "📧 Password reset email for {Email}:\n{Link}"
    )]
    public static partial void PasswordResetEmailSent(
        this ILogger<LoggingEmailSender> logger,
        string email,
        string link
    );

    [LoggerMessage(
        Level = LogLevel.Information,
        Message = "📧 Password reset code for {Email}:\n{Link}"
    )]
    public static partial void PasswordResetCodeSent(
        this ILogger<LoggingEmailSender> logger,
        string email,
        string link
    );
}
