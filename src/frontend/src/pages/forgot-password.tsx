import { useState } from 'react';
import { Link } from 'react-router';

import { usePostApiAuthForgotPassword } from '@/api/auth.gen';
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

export function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const forgotPasswordMutation = usePostApiAuthForgotPassword();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;

    try {
      await forgotPasswordMutation.mutateAsync({ data: { email } });
    } catch {
      // Ignore errors - don't reveal if email exists
    }
    // Always show success to prevent email enumeration
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Check your email</CardTitle>
          <CardDescription>
            If an account exists with that email, we've sent a password reset
            link.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link to="/login" className={buttonVariants({ variant: 'outline' })}>
            Back to Login
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Forgot your password?</CardTitle>
        <CardDescription>
          Enter your email and we'll send you a reset link
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </Field>
            <Button
              type="submit"
              className="w-full"
              disabled={forgotPasswordMutation.isPending}
            >
              {forgotPasswordMutation.isPending
                ? 'Sending...'
                : 'Send reset link'}
            </Button>
            <div className="text-center">
              <Link to="/login" className="text-sm underline">
                Back to Login
              </Link>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
