import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup } from '@/components/ui/field';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';

interface OTPFormProps extends Omit<
  React.ComponentProps<typeof Card>,
  'onChange' | 'onSubmit'
> {
  title?: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  onBack?: () => void;
  submitLabel?: string;
  isLoading?: boolean;
  error?: string | null;
}

export function OTPForm({
  title = 'Two-Factor Authentication',
  description = 'Enter the code from your authenticator app',
  value,
  onChange,
  onSubmit,
  onBack,
  submitLabel = 'Verify',
  isLoading = false,
  error,
  ...props
}: OTPFormProps) {
  function handleComplete() {
    // Small delay to let the UI update with the last digit
    setTimeout(() => {
      onSubmit();
    }, 100);
  }

  return (
    <Card {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <FieldGroup>
            {error && (
              <div className="bg-destructive/10 text-destructive rounded-md p-3 text-center text-sm">
                {error}
              </div>
            )}
            <Field>
              <div className="flex w-full items-center justify-center">
                <InputOTP
                  maxLength={6}
                  value={value}
                  onChange={onChange}
                  onComplete={handleComplete}
                  autoFocus
                >
                  <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <FieldDescription className="text-center">
                Enter the 6-digit code from your authenticator app.
              </FieldDescription>
            </Field>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || value.length !== 6}
            >
              {isLoading ? 'Verifying...' : submitLabel}
            </Button>
            {onBack && (
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={onBack}
              >
                ← Back to login
              </Button>
            )}
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
