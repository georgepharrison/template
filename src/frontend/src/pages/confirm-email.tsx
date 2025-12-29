import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';

import { mapIdentityApiApiAuthConfirmEmail } from '@/api/auth.gen';
import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function ConfirmEmailPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );

  useEffect(() => {
    const userId = searchParams.get('userId');
    const code = searchParams.get('code');

    if (!userId || !code) {
      setStatus('error');
      return;
    }

    mapIdentityApiApiAuthConfirmEmail({ userId, code })
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [searchParams]);

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">
          {status === 'loading' && 'Confirming your email...'}
          {status === 'success' && 'Email confirmed!'}
          {status === 'error' && 'Confirmation failed'}
        </CardTitle>
        <CardDescription>
          {status === 'success' &&
            'Your email has been verified. You can now log in.'}
          {status === 'error' &&
            'The confirmation link is invalid or has expired.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        {status === 'success' && (
          <Link to="/login" className={buttonVariants({ variant: 'default' })}>
            Go to Login
          </Link>
        )}
        {status === 'error' && (
          <Link to="/login" className={buttonVariants({ variant: 'outline' })}>
            Back to Login
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
