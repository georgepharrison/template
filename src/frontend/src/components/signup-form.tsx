import { useState } from 'react';
import { Link } from 'react-router';

import {
  usePostApiAuthRegister,
  type HttpValidationProblemDetails,
} from '@/api/auth.gen';
import { PasswordRequirements } from '@/components/password-requirements';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [success, setSuccess] = useState(false);

  const registerMutation = usePostApiAuthRegister();

  function getFieldErrors(field: 'email' | 'password') {
    const fieldPatterns = {
      email: ['email', 'username', 'user'],
      password: ['password'],
    };

    return Object.entries(fieldErrors)
      .filter(([key]) =>
        fieldPatterns[field].some((pattern) =>
          key.toLowerCase().includes(pattern)
        )
      )
      .flatMap(([, messages]) => messages);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;

    try {
      await registerMutation.mutateAsync({
        data: { email, password },
      });
      setSuccess(true);
    } catch (err) {
      const validationError = err as HttpValidationProblemDetails;
      if (validationError.errors) {
        setFieldErrors(validationError.errors);
      } else if (validationError.detail) {
        setError(validationError.detail);
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  }

  const emailErrors = getFieldErrors('email');
  const passwordErrors = getFieldErrors('password');

  if (success) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Check your email</CardTitle>
          <CardDescription>
            We've sent a confirmation link to your email address. Please click
            the link to verify your account.
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
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
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
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
                {emailErrors.map((msg) => (
                  <FieldError key={msg}>{msg}</FieldError>
                ))}
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <PasswordRequirements password={password} />
                {passwordErrors.map((msg) => (
                  <FieldError key={msg}>{msg}</FieldError>
                ))}
              </Field>
              <Field>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending
                    ? 'Creating account...'
                    : 'Sign up'}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <Link to="/login">Log in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
