import { useCallback } from 'react';

import { Pages } from '@/modules/core/routes';

import { useWalletSignIn } from './useWalletSignIn';
import { useWebAuthnSignIn } from './useWebAuthnSignIn';

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
  const webAuthnSignIn = useWebAuthnSignIn(redirect);

  return {
    ...walletSignIn,
    ...webAuthnSignIn,
  };
};

export { useWebSignIn };
