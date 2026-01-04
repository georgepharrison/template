import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { getGetApiAuthMeQueryKey, usePostApiAuthLogin } from '@/api/auth.gen';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { cn } from '@/lib/utils';

import { OTPForm } from './otp-form';
import { Link } from './ui/link';

const REMEMBERED_EMAIL_KEY = 'remembered-email';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showLockoutDialog, setShowLockoutDialog] = useState(false);
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');

  const loginMutation = usePostApiAuthLogin();

  // Load remembered email on mount
  useEffect(() => {
    const remembered = localStorage.getItem(REMEMBERED_EMAIL_KEY);
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, []);

  async function handleSubmit(event?: React.FormEvent) {
    event?.preventDefault();
    setError(null);

    // Save or clear remembered email
    if (rememberMe) {
      localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
    } else {
      localStorage.removeItem(REMEMBERED_EMAIL_KEY);
    }

    // Build login request
    const loginData: {
      email: string;
      password: string;
      twoFactorCode?: string;
      twoFactorRecoveryCode?: string;
    } = { email, password };

    // If 2FA is required, add the code
    if (requiresTwoFactor && twoFactorCode) {
      // Recovery codes are in format XXXXX-XXXXX (11 chars with dash)
      // TOTP codes are 6 digits
      if (twoFactorCode.includes('-') || twoFactorCode.length > 6) {
        loginData.twoFactorRecoveryCode = twoFactorCode;
      } else {
        loginData.twoFactorCode = twoFactorCode;
      }
    }

    try {
      await loginMutation.mutateAsync({
        data: loginData,
        params: { useCookies: true },
      });
      await queryClient.invalidateQueries({
        queryKey: getGetApiAuthMeQueryKey(),
      });
      navigate('/');
    } catch (err) {
      const detail = (err as { detail?: string })?.detail;

      if (detail === 'LockedOut') {
        setShowLockoutDialog(true);
      } else if (detail === 'RequiresTwoFactor') {
        setRequiresTwoFactor(true);
        setTwoFactorCode('');
      } else if (requiresTwoFactor) {
        setError('Invalid two-factor code. Please try again.');
      } else {
        setError('Invalid email or password');
      }
    }
  }

  function handleGoogleLogin() {
    const returnUrl = encodeURIComponent(window.location.origin + '/');
    window.location.href = `/api/auth/login-google?returnUrl=${returnUrl}`;
  }

  function handleBackToLogin() {
    setRequiresTwoFactor(false);
    setTwoFactorCode('');
    setPassword('');
    setError(null);
  }

  // 2FA flow
  if (requiresTwoFactor) {
    return (
      <div className={cn('flex flex-col gap-6', className)} {...props}>
        <OTPForm
          value={twoFactorCode}
          onChange={setTwoFactorCode}
          onSubmit={handleSubmit}
          onBack={handleBackToLogin}
          isLoading={loginMutation.isPending}
          error={error}
        />
      </div>
    );
  }

  // Normal login flow
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Apple or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col gap-4">
                <Button variant="outline" className="w-full" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Apple
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  type="button"
                  onClick={handleGoogleLogin}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Google
                </Button>
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    to="/forgot-password"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <PasswordInput
                  id="password"
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
              <Field>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked === true)
                    }
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
              </Field>
              {error && (
                <div className="bg-destructive/10 text-destructive rounded-md p-3 text-center text-sm">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? 'Logging in...' : 'Login'}
              </Button>
              <FieldDescription className="text-center">
                Don&apos;t have an account?{' '}
                <Link to="/signup" className="underline">
                  Sign up
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <AlertDialog open={showLockoutDialog} onOpenChange={setShowLockoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Account Locked</AlertDialogTitle>
            <AlertDialogDescription>
              Your account has been temporarily locked due to too many failed
              login attempts. Please try again later or reset your password.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowLockoutDialog(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
