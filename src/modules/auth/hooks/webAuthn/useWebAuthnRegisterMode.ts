import { useState } from 'react';

import { WebAuthnModeState, WebAuthnTabState } from '@/modules';

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

  const createWebAuthnAccount = useCreateWebAuthnAccount();

  const handleRegister = form.handleSubmit(async ({ username }) => {
    setIsRegistering(true);
    setRegisterProgress(50);

    await createWebAuthnAccount.mutateAsync(username, {
      onSuccess: async () => {
        setRegisterProgress(100);
        setIsRegistering(false);
        setCreatedAcccountUsername(username);
        setMode(WebAuthnModeState.ACCOUNT_CREATED);
        setTab(WebAuthnTabState.ACCOUNT_CREATED);
      },
      onError: (error) => {
        setRegisterProgress(0);
        setIsRegistering(false);
        console.error(error);
      },
    });
  });

  return { isRegistering, registerProgress, handleRegister };
};

export { useWebAuthnRegisterMode };
