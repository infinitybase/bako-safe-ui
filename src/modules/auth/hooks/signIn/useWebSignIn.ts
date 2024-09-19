import { useCallback, useEffect } from 'react';

import { Pages } from '@/modules/core/routes';

import { useWebAuthnLastLogin } from '../webAuthn/useWebAuthnLastLogin';
import { useWalletSignIn } from './useWalletSignIn';
import { useWebAuthnSignIn, WebAuthnModeState } from './useWebAuthnSignIn';

export type UseWebSignIn = ReturnType<typeof useWebSignIn>;

const useWebSignIn = () => {
  const redirect = useCallback((vaultId?: string, workspaceId?: string) => {
    if (vaultId && vaultId.length === 36 && workspaceId) {
      return Pages.detailsVault({
        vaultId: vaultId ?? '',
        workspaceId: workspaceId ?? '',
      });
    }

    return Pages.home();
  }, []);

  const walletSignIn = useWalletSignIn(redirect);
  const { formData, setMode, ...rest } = useWebAuthnSignIn(redirect);
  const { lastLoginUsername } = useWebAuthnLastLogin();

  useEffect(() => {
    if (lastLoginUsername) {
      formData.form.setValue('username', lastLoginUsername ?? '');
      setMode(WebAuthnModeState.LOGIN);
    }
  }, []);

  return {
    ...walletSignIn,
    ...rest,
    formData,
  };
};

export { useWebSignIn };
