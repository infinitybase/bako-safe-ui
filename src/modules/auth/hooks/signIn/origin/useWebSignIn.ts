import { useCallback } from 'react';

import { Pages } from '@/modules/core/routes';

import { ISignInRedirect } from './types';

export type UseWebSignIn = ReturnType<typeof useWebSignIn>;

const useWebSignIn = (): ISignInRedirect => {
  const redirect = useCallback((vaultId?: string, workspaceId?: string) => {
    if (vaultId && vaultId.length === 36 && workspaceId) {
      return Pages.detailsVault({
        vaultId: vaultId ?? '',
        workspaceId: workspaceId ?? '',
      });
    }

    return Pages.home();
  }, []);

  return {
    redirect,
  };
};

export { useWebSignIn };
