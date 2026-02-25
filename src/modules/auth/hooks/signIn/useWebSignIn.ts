import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Pages } from '@/modules/core/routes';

import { useWebAuthnLastLogin } from '../webAuthn/useWebAuthnLastLogin';
import { useSocialSignIn } from './useSocialSignIn';
import { useWalletSignIn } from './useWalletSignIn';
import { useWebAuthnSignIn, WebAuthnModeState } from './useWebAuthnSignIn';

export type UseWebSignIn = ReturnType<typeof useWebSignIn>;

const useWebSignIn = () => {
  const navigate = useNavigate();

  const redirect = useCallback((vaultId?: string, workspaceId?: string) => {
    if (vaultId && vaultId.length === 36 && workspaceId) {
      navigate(
        Pages.detailsVault({
          vaultId: vaultId ?? '',
          workspaceId: workspaceId ?? '',
        }),
      );
      return;
    }

    return navigate(Pages.home());
  }, []);

  const walletSignIn = useWalletSignIn(redirect);
  const { formData, setMode, handleInputChange, ...rest } =
    useWebAuthnSignIn(redirect);
  const { lastLoginUsername } = useWebAuthnLastLogin();
  const socialSignIn = useSocialSignIn(redirect);

  useEffect(() => {
    if (lastLoginUsername) {
      formData.form.setValue('username', lastLoginUsername ?? '', {
        shouldValidate: true,
      });
      handleInputChange?.(lastLoginUsername);
      setMode(WebAuthnModeState.LOGIN);
    }
  }, []);

  return {
    ...walletSignIn,
    ...rest,
    ...socialSignIn,
    handleInputChange,
    setMode,
    formData,
  };
};

export { useWebSignIn };
