using System.Net;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;

namespace Template.Server;

public static class AuthEndpoints
{
    private const string BasePath = "/api/auth";

    public static void MapAuthEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup(BasePath).WithTags("Auth");

        group.MapIdentityApi<IdentityUser>();

        group.MapPost(
            "/logout",
            async (SignInManager<IdentityUser> signInManager) =>
            {
                await signInManager.SignOutAsync();
                return Results.Ok();
            }
        );

        group.MapGet(
            "/login-google",
            (string? returnUrl) =>
            {
                var redirectUrl =
                    $"{BasePath}/google-callback?returnUrl={Uri.EscapeDataString(returnUrl ?? "/")}";
                var properties = new AuthenticationProperties { RedirectUri = redirectUrl };
                return Results.Challenge(properties, ["Google"]);
            }
        );

        group.MapGet(
            "/google-callback",
            async (
                string? returnUrl,
                HttpContext httpContext,
                SignInManager<IdentityUser> signInManager,
                UserManager<IdentityUser> userManager
            ) =>
            {
                var result = await httpContext.AuthenticateAsync(IdentityConstants.ExternalScheme);
                if (!result.Succeeded || result.Principal == null)
                {
                    return Results.Redirect("/login?error=external-login-failed");
                }

                var email = result.Principal.FindFirstValue(ClaimTypes.Email);
                var providerKey = result.Principal.FindFirstValue(ClaimTypes.NameIdentifier);
                var picture = result.Principal.FindFirstValue("picture");
                const string loginProvider = "Google";

                if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(providerKey))
                {
                    return Results.Redirect("/login?error=no-email");
                }

                var signInResult = await signInManager.ExternalLoginSignInAsync(
                    loginProvider,
                    providerKey,
                    isPersistent: true
                );

                if (signInResult.Succeeded)
                {
                    // Update picture on existing user
                    var existingUser = await userManager.FindByEmailAsync(email);
                    if (existingUser != null && !string.IsNullOrEmpty(picture))
                    {
                        await UpdatePictureClaim(userManager, existingUser, picture);
                    }

                    await httpContext.SignOutAsync(IdentityConstants.ExternalScheme);
                    return Results.Redirect(returnUrl ?? "/");
                }

                var user = await userManager.FindByEmailAsync(email);
                if (user == null)
                {
                    user = new IdentityUser
                    {
                        UserName = email,
                        Email = email,
                        EmailConfirmed = true,
                    };
                    var createResult = await userManager.CreateAsync(user);
                    if (!createResult.Succeeded)
                    {
                        return Results.Redirect("/login?error=create-failed");
                    }
                }

                // Store picture as claim
                if (!string.IsNullOrEmpty(picture))
                {
                    await UpdatePictureClaim(userManager, user, picture);
                }

                var loginInfo = new UserLoginInfo(loginProvider, providerKey, loginProvider);
                await userManager.AddLoginAsync(user, loginInfo);

                await signInManager.SignInAsync(user, isPersistent: true);
                await httpContext.SignOutAsync(IdentityConstants.ExternalScheme);

                return Results.Redirect(returnUrl ?? "/");
            }
        );

        group.MapPost(
            "/forgot-password",
            async (
                ForgotPasswordRequest request,
                UserManager<IdentityUser> userManager,
                IEmailSender<IdentityUser> emailSender,
                HttpContext httpContext
            ) =>
            {
                var user = await userManager.FindByEmailAsync(request.Email);
                if (user == null || !await userManager.IsEmailConfirmedAsync(user))
                {
                    return Results.Ok();
                }

                var code = await userManager.GeneratePasswordResetTokenAsync(user);
                var encodedCode = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));

                var resetLink =
                    $"{httpContext.Request.Scheme}://{httpContext.Request.Host}/api/auth/resetPassword?email={WebUtility.UrlEncode(request.Email)}&code={encodedCode}";

                await emailSender.SendPasswordResetLinkAsync(user, request.Email, resetLink);

                return Results.Ok();
            }
        );

        // Custom endpoint to get user info with picture
        group
            .MapGet(
                "/me",
                async (HttpContext httpContext, UserManager<IdentityUser> userManager) =>
                {
                    var userId = userManager.GetUserId(httpContext.User);
                    if (userId == null)
                    {
                        return Results.Unauthorized();
                    }

                    var user = await userManager.FindByIdAsync(userId);
                    if (user == null)
                    {
                        return Results.Unauthorized();
                    }

                    var claims = await userManager.GetClaimsAsync(user);
                    var picture = claims.FirstOrDefault(c => c.Type == "picture")?.Value;

                    return Results.Ok(
                        new UserInfoResponse(user.Email ?? "", user.EmailConfirmed, picture)
                    );
                }
            )
            .RequireAuthorization()
            .Produces<UserInfoResponse>();
    }

    private static async Task UpdatePictureClaim(
        UserManager<IdentityUser> userManager,
        IdentityUser user,
        string picture
    )
    {
        var existingClaims = await userManager.GetClaimsAsync(user);
        var existingPicture = existingClaims.FirstOrDefault(c => c.Type == "picture");

        if (existingPicture != null)
        {
            await userManager.RemoveClaimAsync(user, existingPicture);
        }

        await userManager.AddClaimAsync(user, new Claim("picture", picture));
    }
}

public record ForgotPasswordRequest(string Email);

public record UserInfoResponse(string Email, bool IsEmailConfirmed, string? Picture);
