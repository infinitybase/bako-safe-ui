import { useCallback, useEffect, useState } from 'react';

import { useTab } from '@/modules/core/hooks';
import { EnumUtils } from '@/modules/core/utils';
import { ActionKeys, handleActionUsingKeys } from '@/utils';

import { TypeUser } from '../../services/methods';
import {
  useWebAuthnForm,
  useWebAuthnInput,
  useWebAuthnLastLogin,
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

const useWebAuthnSignIn = () => {
  const [mode, setMode] = useState(WebAuthnModeState.SEARCH);
  const [createdAcccountUsername, setCreatedAcccountUsername] = useState('');

  const tabs = useTab({
    tabs: EnumUtils.toNumberArray(WebAuthnTabState),
    defaultTab: WebAuthnTabState.LOGIN,
  });
  const { form } = useWebAuthnForm(mode);
  const { checkNicknameRequest, accountsRequest, ...rest } = useWebAuthnInput(
    !form.formState.errors.username,
  );
  const { handleLogin, isSigningIn, signInProgress } = useWebAuthnSignInMode(
    form,
    setMode,
  );
  const { isRegistering, registerProgress, handleRegister } =
    useWebAuthnRegisterMode({
      form,
      setMode,
      setTab: tabs.set,
      setCreatedAcccountUsername,
    });
  const { lastLoginUsername } = useWebAuthnLastLogin();

  const isRegisterMode = mode === WebAuthnModeState.REGISTER;
  const isSearchModeBtnDisabled =
    checkNicknameRequest.isLoading ||
    !form.formState.isValid ||
    !window.navigator.credentials;
  const isLoginModeBtnDisabled = isSigningIn || !form.formState.isValid;
  const isRegisterModeBtnDisabled = isRegistering || !form.formState.isValid;

  const handleChangeMode = useCallback(() => {
    if (checkNicknameRequest.data?.type === TypeUser.WEB_AUTHN) {
      setMode(WebAuthnModeState.LOGIN);
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
      actionProgress: signInProgress,
      showAccountsOptions: !accountsRequest.isLoading,
    },
    [WebAuthnModeState.REGISTER]: {
      label: 'Create account',
      handleAction: handleRegister,
      handleActionUsingEnterKey: (pressedKey: string) =>
        handleActionUsingKeys({
          pressedKey,
          allowedKeys: [ActionKeys.Enter],
          action: handleRegister,
          enabled: !isRegisterModeBtnDisabled,
        }),
      isLoading: isRegistering,
      isDisabled: isRegisterModeBtnDisabled,
      actionProgress: registerProgress,
      showAccountsOptions: false,
    },
    [WebAuthnModeState.ACCOUNT_CREATED]: {
      label: 'Begin',
      handleAction: handleLogin,
      handleActionUsingEnterKey: undefined,
      isLoading: isSigningIn,
      isDisabled: isLoginModeBtnDisabled,
      actionProgress: signInProgress,
      showAccountsOptions: false,
    },
  };

  useEffect(() => {
    if (lastLoginUsername) {
      form.setValue('username', lastLoginUsername ?? '');
      setMode(WebAuthnModeState.LOGIN);
    }
  }, []);

  useEffect(() => {
    if (checkNicknameRequest.data) {
      handleChangeMode();
    }
  }, [handleChangeMode, checkNicknameRequest.data]);

  return {
    formData: {
      form,
      isRegisterMode,
    },
    formState: formState[mode],
    checkNicknameRequest,
    tabs,
    createdAcccountUsername,
    ...rest,
  };
};

export { useWebAuthnSignIn };
