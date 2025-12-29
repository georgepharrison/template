using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;

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

                var loginInfo = new UserLoginInfo(loginProvider, providerKey, loginProvider);
                await userManager.AddLoginAsync(user, loginInfo);

                await signInManager.SignInAsync(user, isPersistent: true);
                await httpContext.SignOutAsync(IdentityConstants.ExternalScheme);

                return Results.Redirect(returnUrl ?? "/");
            }
        );
    }
}
