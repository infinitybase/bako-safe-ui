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
  const [registerProgress, setRegisterProgress] = useState(0);

  const {
    screenWidths: { isSmallerThan600 },
  } = useScreenSize();
  const { warningToast } = useContactToast();
  const createWebAuthnAccount = useCreateWebAuthnAccount();
  const { setModalIsOpen } = useTermsStore();

  const handleRegister = form.handleSubmit(async ({ username }) => {
    setIsRegistering(true);
    setRegisterProgress(50);

    setModalIsOpen(false);

    await createWebAuthnAccount.mutateAsync(username, {
      onSuccess: async () => {
        setRegisterProgress(100);
        setTimeout(() => {
          setIsRegistering(false);
          setCreatedAcccountUsername(username);
          setMode(WebAuthnModeState.ACCOUNT_CREATED);
          setTab(WebAuthnTabState.ACCOUNT_CREATED);
        }, 800);
      },
      onError: () => {
        setRegisterProgress(0);
        setIsRegistering(false);
        warningToast({
          title: 'Account creation failed',
          description:
            'Sorry, something went wrong while creating your account. Please try again.',
          position: isSmallerThan600 ? 'bottom' : 'top-right',
        });
      },
    });
  });

  return { isRegistering, registerProgress, handleRegister };
};

export { useWebAuthnRegisterMode };
