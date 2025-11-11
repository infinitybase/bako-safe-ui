import { useState } from 'react';

import { useContactToast } from '@/modules/addressBook/hooks';
import { useScreenSize } from '@/modules/core';
import { useTermsStore } from '@/modules/termsOfUse/store/useTermsStore';

import {
  WebAuthnModeState,
  WebAuthnTabState,
} from '../signIn/useWebAuthnSignIn';
import { UseWebAuthnForm } from './useWebAuthnForm';
import { useCreateWebAuthnAccount } from './useWebauthnRequests';

interface UseWebAuthnRegisterModeParams {
  form: UseWebAuthnForm['form'];
  setMode: (mode: WebAuthnModeState) => void;
  setTab: (tab: WebAuthnTabState) => void;
  setCreatedAcccountUsername: (username: string) => void;
}

const useWebAuthnRegisterMode = (params: UseWebAuthnRegisterModeParams) => {
  const { form, setCreatedAcccountUsername, setMode, setTab } = params;

  const [isRegistering, setIsRegistering] = useState(false);

  const { isSmall } = useScreenSize();
  const { warningToast } = useContactToast();
  const createWebAuthnAccount = useCreateWebAuthnAccount();
  const { setModalIsOpen } = useTermsStore();

  const handleRegister = form.handleSubmit(async ({ username }) => {
    setIsRegistering(true);

    setModalIsOpen(false);

    await createWebAuthnAccount.mutateAsync(username, {
      onSuccess: async () => {
        setTimeout(() => {
          setIsRegistering(false);
          setCreatedAcccountUsername(username);
          setMode(WebAuthnModeState.ACCOUNT_CREATED);
          setTab(WebAuthnTabState.ACCOUNT_CREATED);
        }, 800);
      },
      onError: () => {
        setIsRegistering(false);
        warningToast({
          title: 'Account creation failed',
          description:
            'Sorry, something went wrong while creating your account. Please try again.',
          position: isSmall ? 'bottom' : 'top-right',
        });
      },
    });
  });

  return { isRegistering, handleRegister };
};

export { useWebAuthnRegisterMode };
