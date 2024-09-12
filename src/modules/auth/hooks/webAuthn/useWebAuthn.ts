import { useCallback, useState } from 'react';

import { useTab } from '@/modules/core/hooks';
import { EnumUtils } from '@/modules/core/utils';
import { ActionKeys, handleActionUsingKeys } from '@/utils';

import { TypeUser } from '../../services/methods';
import {
  useWebAuthnForm,
  useWebAuthnInput,
  useWebAuthnRegisterMode,
  useWebAuthnSignInMode,
} from '.';

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

export type UseWebAuthn = ReturnType<typeof useWebAuthn>;

const useWebAuthn = () => {
  const [mode, setMode] = useState(WebAuthnModeState.SEARCH);
  const [createdAcccountUsername, setCreatedAcccountUsername] = useState('');

  const isRegisterMode = mode === WebAuthnModeState.REGISTER;
  const tabs = useTab({
    tabs: EnumUtils.toNumberArray(WebAuthnTabState),
    defaultTab: WebAuthnTabState.LOGIN,
  });
  const { form } = useWebAuthnForm(isRegisterMode);
  const { checkNicknameRequest, ...rest } = useWebAuthnInput();
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

  const isSearchModeBtnDisabled =
    checkNicknameRequest.isLoading || !form.formState.isValid;
  const isLoginModeBtnDisabled = isSigningIn || !form.formState.isValid;
  const isRegisterModeBtnDisabled = isRegistering || !form.formState.isValid;

  const handleChangeMode = (newMode: WebAuthnModeState) => {
    setMode(newMode);
  };

  const handleNextStep = useCallback(() => {
    if (checkNicknameRequest.data?.type === TypeUser.WEB_AUTHN) {
      handleChangeMode(WebAuthnModeState.LOGIN);
    } else {
      handleChangeMode(WebAuthnModeState.REGISTER);
    }
  }, [checkNicknameRequest.data?.type]);

  const formState = {
    [WebAuthnModeState.SEARCH]: {
      label: 'Continue',
      handleAction: handleNextStep,
      handleActionUsingEnterKey: (pressedKey: string) =>
        handleActionUsingKeys({
          pressedKey,
          allowedKeys: [ActionKeys.Enter],
          action: handleNextStep,
          enabled: !isSearchModeBtnDisabled,
        }),
      isLoading: false,
      isDisabled: isSearchModeBtnDisabled,
      actionProgress: 0,
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
    },
    [WebAuthnModeState.ACCOUNT_CREATED]: {
      label: 'Begin',
      handleAction: handleLogin,
      handleActionUsingEnterKey: undefined,
      isLoading: isSigningIn,
      isDisabled: isLoginModeBtnDisabled,
      actionProgress: signInProgress,
    },
  };

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

export { useWebAuthn };
