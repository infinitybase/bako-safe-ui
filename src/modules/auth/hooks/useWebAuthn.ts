import debounce from 'lodash.debounce';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';

import { EnumUtils, useTab } from '@/modules/core';

import { localStorageKeys, UserService } from '../services';
import { useDrawerWebAuth } from './useDrawerWebAuthn';
import { useWebAuthnForm } from './useWebAuthnForm';
import {
  useCheckNickname,
  useCreateHardwareId,
  useGetAccountsByHardwareId,
} from './useWebauthnRequests';

export enum WebAuthnState {
  LOGIN = 0,
  REGISTER = 1,
}

export type UseWebAuthn = ReturnType<typeof useWebAuthn>;

const useWebAuthn = () => {
  //drawer for webauthn
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(WebAuthnState.LOGIN);
  const [search, setSearch] = useState('');

  const tabs = useTab<WebAuthnState>({
    tabs: EnumUtils.toNumberArray(WebAuthnState),
    defaultTab: WebAuthnState.LOGIN,
  });
  const { memberForm, loginForm } = useWebAuthnForm();
  const { createAccountMutate, signAccountMutate } = useDrawerWebAuth();

  const hardwareId = useMemo(() => {
    return localStorage.getItem(localStorageKeys.HARDWARE_ID)!;
  }, []);
  const accountsRequest = useGetAccountsByHardwareId(hardwareId);

  const debouncedSearchHandler = useCallback(
    debounce((event: string | ChangeEvent<HTMLInputElement>) => {
      if (typeof event === 'string') {
        setSearch(event);
        return;
      }

      console.log(event);

      memberForm.setValue('name', event.target.value);
      setSearch(event.target.value);
    }, 300),
    [],
  );

  const handleLogin = loginForm.handleSubmit(async ({ name }) => {
    console.log('name', name);

    const acc = accountsRequest.data?.find((user) => user.id === name);
    console.log(acc);
    if (acc) {
      const { code } = await UserService.generateSignInCode(acc.address);
      console.log(code);
      await signAccountMutate
        .mutateAsync({
          id: acc.webauthn.id, // this id is of the webauthn
          challenge: code,
          publicKey: acc.webauthn.publicKey,
        })
        .then((data) => console.log(data));
    }
  });

  const handleCreate = memberForm.handleSubmit(async ({ name }) => {
    await createAccountMutate.mutateAsync(name).catch((error) => {
      console.error(error);
    });
    tabs.set(WebAuthnState.LOGIN);
  });

  const handleChangeTab = (tab: WebAuthnState) => {
    tabs.set(tab);
  };

  const openWebAuthnDrawer = () => {
    setIsOpen(true);
  };

  const closeWebAuthnDrawer = () => {
    setIsOpen(false);
  };

  const goToPage = (page: WebAuthnState) => {
    setPage(page);
  };

  const formState = {
    [WebAuthnState.REGISTER]: {
      isValid: memberForm.formState.isValid,
      primaryAction: 'Create account',
      secondaryAction: undefined,
      handlePrimaryAction: handleCreate,
      handleSecondaryAction: undefined,
      isLoading: createAccountMutate.isLoading,
      title: 'Create your WebAuthn',
      description: 'Create your account to start using WebAuthn',
    },
    [WebAuthnState.LOGIN]: {
      isValid: true,
      primaryAction: 'Sign in ',
      secondaryAction: 'Create account',
      handlePrimaryAction: handleLogin,
      handleSecondaryAction: () => handleChangeTab(WebAuthnState.REGISTER),
      isLoading: signAccountMutate.isLoading,
      title: 'Login with WebAuthn',
      description: 'Select your username to login',
    },
  };

  return {
    goToPage,
    setSearch,
    openWebAuthnDrawer,
    closeWebAuthnDrawer,
    useCreateHardwareId,
    accountsRequest,
    handleChangeTab,
    hardwareId,
    checkNickname: useCheckNickname(search),
    debouncedSearchHandler,
    isOpen,
    search,
    page,
    form: {
      memberForm,
      loginForm,
      formState: formState[tabs.tab],
    },
    tabs,
  };
};

export { useWebAuthn };
