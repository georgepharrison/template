import { Key, Monitor, ShieldCheck, ShieldOff } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

import type { TwoFactorResponse } from '@/api/auth.gen';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup } from '@/components/ui/field';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';

import { SettingsGroup } from './settings-group';
import { SettingsRow } from './settings-row';

export interface SecurityContentProps {
  isLoading2FA: boolean;
  twoFactorData: TwoFactorResponse | null;
  twoFactorError: string | null;
  twoFactorSuccess: string | null;
  showSetup2FA: boolean;
  setShowSetup2FA: (show: boolean) => void;
  showRecoveryCodes: boolean;
  setShowRecoveryCodes: (show: boolean) => void;
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  isPending: boolean;
  getTotpUri: () => string;
  handleEnable2FA: (event?: React.FormEvent) => void;
  handleCodeComplete: () => void;
  handleDisable2FA: () => void;
  handleRegenerateRecoveryCodes: () => void;
}

export function SecurityContent({
  isLoading2FA,
  twoFactorData,
  twoFactorError,
  twoFactorSuccess,
  showSetup2FA,
  setShowSetup2FA,
  showRecoveryCodes,
  setShowRecoveryCodes,
  verificationCode,
  setVerificationCode,
  isPending,
  getTotpUri,
  handleEnable2FA,
  handleCodeComplete,
  handleDisable2FA,
  handleRegenerateRecoveryCodes,
}: SecurityContentProps) {
  if (isLoading2FA) {
    return (
      <div className="text-muted-foreground p-4 text-center text-sm">
        Loading security settings...
      </div>
    );
  }

  const is2FAEnabled = twoFactorData?.isTwoFactorEnabled;

  return (
    <div className="space-y-4">
      {twoFactorError && (
        <div className="bg-destructive/10 text-destructive mx-4 mt-4 rounded-lg p-3 text-center text-sm">
          {twoFactorError}
        </div>
      )}

      {twoFactorSuccess && (
        <div className="mx-4 mt-4 rounded-lg bg-green-500/10 p-3 text-center text-sm text-green-600 dark:text-green-400">
          {twoFactorSuccess}
        </div>
      )}

      {/* 2FA Status */}
      <SettingsGroup title="Two-Factor Authentication">
        <div className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`flex size-10 items-center justify-center rounded-full ${is2FAEnabled ? 'bg-green-500/10' : 'bg-muted'}`}
              >
                {is2FAEnabled ? (
                  <ShieldCheck className="size-5 text-green-600 dark:text-green-400" />
                ) : (
                  <ShieldOff className="text-muted-foreground size-5" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">
                  {is2FAEnabled ? 'Enabled' : 'Disabled'}
                </p>
                <p className="text-muted-foreground text-xs">
                  {is2FAEnabled
                    ? 'Your account is protected'
                    : 'Add extra security to your account'}
                </p>
              </div>
            </div>
            {is2FAEnabled ? (
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:bg-destructive/10"
                onClick={handleDisable2FA}
                disabled={isPending}
              >
                Disable
              </Button>
            ) : (
              <Button size="sm" onClick={() => setShowSetup2FA(true)}>
                Enable
              </Button>
            )}
          </div>

          {/* Setup Flow */}
          {showSetup2FA && !is2FAEnabled && (
            <div className="mt-4 space-y-4 border-t pt-4">
              <ol className="text-muted-foreground list-inside list-decimal space-y-2 text-sm">
                <li>
                  Open your authenticator app (Google Authenticator, etc.)
                </li>
                <li>Scan the QR code below</li>
                <li>Enter the 6-digit code to verify</li>
              </ol>

              {getTotpUri() && (
                <div className="flex justify-center rounded-lg bg-white p-4">
                  <QRCodeSVG value={getTotpUri()} size={160} level="M" />
                </div>
              )}

              {twoFactorData?.sharedKey && (
                <div className="text-center">
                  <p className="text-muted-foreground mb-1 text-xs">
                    Can't scan? Enter manually:
                  </p>
                  <code className="bg-muted rounded px-2 py-1 text-xs font-medium">
                    {twoFactorData.sharedKey}
                  </code>
                </div>
              )}

              <form onSubmit={handleEnable2FA}>
                <FieldGroup>
                  <Field>
                    <div className="flex w-full items-center justify-center">
                      <InputOTP
                        maxLength={6}
                        value={verificationCode}
                        onChange={setVerificationCode}
                        onComplete={handleCodeComplete}
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
                      Enter the 6-digit code from your authenticator app
                    </FieldDescription>
                  </Field>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowSetup2FA(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isPending || verificationCode.length !== 6}
                    >
                      {isPending ? 'Verifying...' : 'Verify'}
                    </Button>
                  </div>
                </FieldGroup>
              </form>
            </div>
          )}
        </div>
      </SettingsGroup>

      {/* Recovery Codes */}
      {is2FAEnabled && (
        <SettingsGroup title="Recovery Codes">
          {showRecoveryCodes && twoFactorData?.recoveryCodes ? (
            <div className="space-y-3 p-4">
              <div className="rounded-lg bg-amber-500/10 p-3 text-sm text-amber-600 dark:text-amber-400">
                <strong>Save these codes!</strong>
                <p className="mt-1 text-xs">
                  Store them safely. Each code can only be used once.
                </p>
              </div>
              <div className="bg-muted grid grid-cols-2 gap-2 rounded-lg p-3 font-mono text-sm">
                {twoFactorData.recoveryCodes.map((code) => (
                  <div key={code} className="text-center">
                    {code}
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowRecoveryCodes(false)}
              >
                I've saved my codes
              </Button>
            </div>
          ) : (
            <>
              <SettingsRow
                icon={Key}
                label="Recovery Codes"
                value={`${twoFactorData?.recoveryCodesLeft ?? 0} remaining`}
                chevron={false}
              />
              <div className="p-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleRegenerateRecoveryCodes}
                  disabled={isPending}
                >
                  Generate New Codes
                </Button>
              </div>
            </>
          )}
        </SettingsGroup>
      )}

      {/* Active Sessions */}
      <SettingsGroup title="Sessions">
        <SettingsRow icon={Monitor} label="Active Sessions" value="1 device" />
      </SettingsGroup>
    </div>
  );
}
