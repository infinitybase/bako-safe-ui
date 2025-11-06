import { TypeUser } from 'bakosafe';
import { useCallback, useEffect, useState } from 'react';

import { useTab } from '@/modules/core/hooks';
import { EnumUtils } from '@/modules/core/utils';
import { useTermsStore } from '@/modules/termsOfUse/store/useTermsStore';
import { ActionKeys, handleActionUsingKeys } from '@/utils';

import {
  useWebAuthnForm,
  useWebAuthnInput,
  useWebAuthnRegisterMode,
  useWebAuthnSignInMode,
} from '../webAuthn';

export enum WebAuthnTabState {
  LOGIN = 0,
  ACCOUNT_CREATED = 1,
}

export enum WebAuthnModeState {
  SEARCH = 0,
  LOGIN = 1,
  REGISTER = 2,
  ACCOUNT_CREATED = 3,
}

export type UseWebAuthnSignIn = ReturnType<typeof useWebAuthnSignIn>;

const useWebAuthnSignIn = (
  signInCallback: (vaultId?: string, workspaceId?: string) => void,
) => {
  const [mode, setMode] = useState(WebAuthnModeState.SEARCH);
  const [createdAcccountUsername, setCreatedAcccountUsername] = useState('');

  const tabs = useTab({
    tabs: EnumUtils.toNumberArray(WebAuthnTabState),
    defaultTab: WebAuthnTabState.LOGIN,
  });

  const { form } = useWebAuthnForm();

  const { checkNicknameRequest, accountsRequest, badge, ...rest } =
    useWebAuthnInput(!form.formState.errors.username);
  const { handleLogin, isSigningIn, signInProgress } = useWebAuthnSignInMode({
    form,
    setMode,
    callback: signInCallback,
  });
  const { isRegistering, registerProgress, handleRegister } =
    useWebAuthnRegisterMode({
      form,
      setMode,
      setTab: tabs.set,
      setCreatedAcccountUsername,
    });
  const { setModalIsOpen } = useTermsStore();

  const isRegisterMode = mode === WebAuthnModeState.REGISTER;

  const isSearchModeBtnDisabled =
    !form.formState.isValid ||
    !!form.formState.errors.username ||
    checkNicknameRequest.isLoading ||
    !window.navigator.credentials;
  const isLoginModeBtnDisabled =
    isSigningIn ||
    !form.formState.isValid ||
    !!form.formState.errors.username ||
    checkNicknameRequest.isLoading ||
    !window.navigator.credentials;
  const isRegisterModeBtnDisabled =
    isRegistering ||
    !form.formState.isValid ||
    !!form.formState.errors.username ||
    checkNicknameRequest.isLoading ||
    !window.navigator.credentials;

  const handleCheckUsername = useCallback(() => {
    if (checkNicknameRequest.data?.type === TypeUser.WEB_AUTHN) {
      setMode(WebAuthnModeState.LOGIN);
    } else if (checkNicknameRequest.data?.type) {
      setMode(WebAuthnModeState.SEARCH);
      form.setError('username', { message: 'Username is already being used' });
    } else {
      setMode(WebAuthnModeState.REGISTER);
    }
  }, [checkNicknameRequest.data?.type]);

  const formState = {
    [WebAuthnModeState.SEARCH]: {
      label: 'Continue',
      handleAction: () => {},
      handleActionUsingEnterKey: undefined,
      isLoading: false,
      isDisabled: isSearchModeBtnDisabled,
      disableInput: false,
      actionProgress: 0,
      showAccountsOptions: !accountsRequest.isLoading,
    },
    [WebAuthnModeState.LOGIN]: {
      label: 'Login account',
      handleAction: handleLogin,
      handleActionUsingEnterKey: (pressedKey: string) =>
        handleActionUsingKeys({
          pressedKey,
          allowedKeys: [ActionKeys.Enter],
          action: handleLogin,
          enabled: !isLoginModeBtnDisabled,
        }),
      isLoading: isSigningIn,
      isDisabled: isLoginModeBtnDisabled,
      disableInput: isSigningIn,
      actionProgress: signInProgress,
      showAccountsOptions: !accountsRequest.isLoading,
    },
    [WebAuthnModeState.REGISTER]: {
      label: 'Create account',
      handleAction: () => setModalIsOpen(true),
      handleActionUsingEnterKey: (pressedKey: string) =>
        handleActionUsingKeys({
          pressedKey,
          allowedKeys: [ActionKeys.Enter],
          action: handleRegister,
          enabled: !isRegisterModeBtnDisabled,
        }),
      isLoading: isRegistering,
      isDisabled: isRegisterModeBtnDisabled,
      disableInput: isRegistering,
      actionProgress: registerProgress,
      showAccountsOptions: false,
    },
    [WebAuthnModeState.ACCOUNT_CREATED]: {
      label: 'Begin',
      handleAction: handleLogin,
      handleActionUsingEnterKey: undefined,
      isLoading: isSigningIn,
      isDisabled: isLoginModeBtnDisabled,
      disableInput: false,
      actionProgress: signInProgress,
      showAccountsOptions: false,
    },
  };

  useEffect(() => {
    if (checkNicknameRequest.data) {
      handleCheckUsername();
    }
  }, [handleCheckUsername, checkNicknameRequest.data]);

  return {
    formData: {
      form,
      isRegisterMode,
    },
    fullFormState: formState,
    formState: formState[mode],
    handleRegister,
    checkNicknameRequest,
    tabs,
    createdAcccountUsername,
    inputBadge: badge,
    isSigningIn,
    isRegistering,
    mode,
    setMode,
    handleLogin,
    ...rest,
  };
};

export { useWebAuthnSignIn };
