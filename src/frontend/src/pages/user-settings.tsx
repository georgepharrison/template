// src/frontend/src/pages/user-settings.tsx
import { useEffect, useState } from 'react';

import {
  usePostApiAuthManage2fa,
  type TwoFactorResponse,
} from '@/api/auth.gen';
import {
  DesktopLayout,
  MobileLayout,
  type SecurityContentProps,
} from '@/components/user-settings';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/hooks/use-theme';

// Your app/organization name - shown in authenticator apps
const TOTP_ISSUER = 'Acme Inc';

export function UserSettingsPage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  // 2FA State
  const [twoFactorData, setTwoFactorData] = useState<TwoFactorResponse | null>(
    null
  );
  const [verificationCode, setVerificationCode] = useState('');
  const [twoFactorError, setTwoFactorError] = useState<string | null>(null);
  const [twoFactorSuccess, setTwoFactorSuccess] = useState<string | null>(null);
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);
  const [isLoading2FA, setIsLoading2FA] = useState(true);
  const [showSetup2FA, setShowSetup2FA] = useState(false);

  const manage2FAMutation = usePostApiAuthManage2fa();

  // Fetch 2FA status on mount
  useEffect(() => {
    fetchTwoFactorStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchTwoFactorStatus() {
    setTwoFactorError(null);
    try {
      const response = await manage2FAMutation.mutateAsync({ data: {} });
      setTwoFactorData(response);
    } catch {
      setTwoFactorError('Failed to fetch 2FA status');
    } finally {
      setIsLoading2FA(false);
    }
  }

  async function handleEnable2FA(event?: React.FormEvent) {
    event?.preventDefault();
    setTwoFactorError(null);
    setTwoFactorSuccess(null);

    try {
      const response = await manage2FAMutation.mutateAsync({
        data: {
          enable: true,
          twoFactorCode: verificationCode,
        },
      });
      setTwoFactorData(response);
      setVerificationCode('');

      if (response.isTwoFactorEnabled) {
        setTwoFactorSuccess('Two-factor authentication has been enabled!');
        setShowRecoveryCodes(true);
        setShowSetup2FA(false);
      }
    } catch {
      setTwoFactorError('Invalid verification code. Please try again.');
      setVerificationCode('');
    }
  }

  function handleCodeComplete() {
    setTimeout(() => {
      handleEnable2FA();
    }, 100);
  }

  async function handleDisable2FA() {
    setTwoFactorError(null);
    setTwoFactorSuccess(null);

    try {
      await manage2FAMutation.mutateAsync({
        data: { forgetMachine: true },
      });
      const response = await manage2FAMutation.mutateAsync({
        data: { resetSharedKey: true },
      });
      setTwoFactorData(response);
      setTwoFactorSuccess('Two-factor authentication has been disabled.');
      setShowRecoveryCodes(false);
    } catch {
      setTwoFactorError('Failed to disable 2FA');
    }
  }

  async function handleRegenerateRecoveryCodes() {
    setTwoFactorError(null);
    setTwoFactorSuccess(null);

    try {
      const response = await manage2FAMutation.mutateAsync({
        data: { resetRecoveryCodes: true },
      });
      setTwoFactorData(response);
      setShowRecoveryCodes(true);
      setTwoFactorSuccess('New recovery codes have been generated.');
    } catch {
      setTwoFactorError('Failed to generate new recovery codes');
    }
  }

  function getTotpUri() {
    if (!twoFactorData?.sharedKey || !user?.email) return '';
    const secret = twoFactorData.sharedKey.replace(/\s/g, '');
    return `otpauth://totp/${encodeURIComponent(TOTP_ISSUER)}:${encodeURIComponent(user.email)}?secret=${secret}&issuer=${encodeURIComponent(TOTP_ISSUER)}&digits=6`;
  }

  const securityProps: SecurityContentProps = {
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
    isPending: manage2FAMutation.isPending,
    getTotpUri,
    handleEnable2FA,
    handleCodeComplete,
    handleDisable2FA,
    handleRegenerateRecoveryCodes,
  };

  return (
    <>
      <MobileLayout
        email={user?.email}
        picture={user?.picture}
        isEmailConfirmed={user?.isEmailConfirmed}
        theme={theme}
        setTheme={setTheme}
        securityProps={securityProps}
        onLogout={logout}
      />
      <DesktopLayout
        email={user?.email}
        picture={user?.picture}
        theme={theme}
        setTheme={setTheme}
        securityProps={securityProps}
        onLogout={logout}
      />
    </>
  );
}
