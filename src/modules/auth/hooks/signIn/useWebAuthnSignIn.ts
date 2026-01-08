import { useCallback, useEffect, useMemo, useState } from 'react';

import { AutocompleteBadgeStatus } from '@/components';
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
  WELCOME = 2,
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
  const [mode, setMode] = useState(WebAuthnModeState.LOGIN);
  const [createdAcccountUsername, setCreatedAcccountUsername] = useState('');

  const tabs = useTab({
    tabs: EnumUtils.toNumberArray(WebAuthnTabState),
    defaultTab: WebAuthnTabState.LOGIN,
  });

  const { form } = useWebAuthnForm();
  const {
    checkNicknameRequest,
    accountsRequest,
    badge,
    isBadgeStatusValid,
    ...rest
  } = useWebAuthnInput(!form.formState.errors.username, undefined, mode);

  const handleSignInCallback = useCallback(
    (username: string, vaultId?: string, workspaceId?: string) => {
      setCreatedAcccountUsername(username);
      tabs.set(WebAuthnTabState.WELCOME);
      setTimeout(() => signInCallback(vaultId, workspaceId), 1500);
    },
    [signInCallback, tabs],
  );

  const { handleLogin, isSigningIn } = useWebAuthnSignInMode({
    form,
    setMode,
    callback: handleSignInCallback,
  });
  const { isRegistering, handleRegister } = useWebAuthnRegisterMode({
    form,
    setMode,
    setTab: tabs.set,
    setCreatedAcccountUsername,
  });
  const { setModalIsOpen } = useTermsStore();

  const isRegisterMode = useMemo(
    () => mode === WebAuthnModeState.REGISTER,
    [mode],
  );

  const isSearchModeBtnDisabled =
    !form.formState.isValid ||
    !!form.formState.errors.username ||
    checkNicknameRequest.isLoading ||
    !window.navigator.credentials;
  const isLoginModeBtnDisabled =
    isSigningIn ||
    !form.formState.isValid ||
    !!form.formState.errors.username ||
    !isBadgeStatusValid ||
    !window.navigator.credentials;
  const isRegisterModeBtnDisabled =
    isRegistering ||
    !form.formState.isValid ||
    !!form.formState.errors.username ||
    !isBadgeStatusValid ||
    !window.navigator.credentials;

  const formState = {
    [WebAuthnModeState.SEARCH]: {
      label: 'Continue',
      handleAction: () => {},
      handleActionUsingEnterKey: undefined,
      isLoading: false,
      isDisabled: isSearchModeBtnDisabled,
      disableInput: false,
      actionProgress: 0,
      isLoadingOptions: accountsRequest.isLoading,
    },
    [WebAuthnModeState.LOGIN]: {
      label: 'Continue',
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
      isLoadingOptions: accountsRequest.isLoading,
    },
    [WebAuthnModeState.REGISTER]: {
      label: 'Create',
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
      isLoadingOptions: false,
    },
    [WebAuthnModeState.ACCOUNT_CREATED]: {
      label: 'Begin',
      handleAction: handleLogin,
      handleActionUsingEnterKey: undefined,
      isLoading: isSigningIn,
      isDisabled: isLoginModeBtnDisabled,
      disableInput: false,
      isLoadingOptions: false,
    },
  };

  useEffect(() => {
    if (badge?.status === AutocompleteBadgeStatus.ERROR) {
      form.setError('username', {
        message: badge.label,
      });
    } else {
      form.trigger('username');
    }
  }, [badge?.status, badge?.label, mode]);

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
