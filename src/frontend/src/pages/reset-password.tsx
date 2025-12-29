import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';

import { usePostApiAuthResetPassword } from '@/api/auth.gen';
import { PasswordRequirements } from '@/components/password-requirements';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'form' | 'success' | 'error'>('form');
  const [error, setError] = useState<string | null>(null);

  const resetPasswordMutation = usePostApiAuthResetPassword();

  const email = searchParams.get('email') ?? '';
  const resetCode = searchParams.get('code') ?? '';

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!email || !resetCode) {
      setStatus('error');
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({
        data: { email, resetCode, newPassword: password },
      });
      setStatus('success');
    } catch {
      setError('Failed to reset password. The link may have expired.');
    }
  }

  if (!email || !resetCode) {
    return (
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Invalid reset link</CardTitle>
          <CardDescription>
            This password reset link is invalid or has expired.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link
            to="/forgot-password"
            className={buttonVariants({ variant: 'outline' })}
          >
            Request new link
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (status === 'success') {
    return (
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Password reset!</CardTitle>
          <CardDescription>
            Your password has been updated. You can now log in.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link to="/login" className={buttonVariants({ variant: 'default' })}>
            Go to Login
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Reset your password</CardTitle>
        <CardDescription>Enter your new password below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            {error && (
              <div className="bg-destructive/10 text-destructive rounded-md p-3 text-center text-sm">
                {error}
              </div>
            )}
            <Field>
              <FieldLabel htmlFor="password">New Password</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <PasswordRequirements password={password} />
            </Field>
            <Button
              type="submit"
              className="w-full"
              disabled={resetPasswordMutation.isPending}
            >
              {resetPasswordMutation.isPending
                ? 'Resetting...'
                : 'Reset password'}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
