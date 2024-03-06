import debounce from 'lodash.debounce';
import { ChangeEvent, useCallback, useState } from 'react';

import { EnumUtils, useTab } from '@/modules/core';

import { localStorageKeys, UserService } from '../services';
import { useDrawerWebAuth } from './useDrawerWebAuthn';
import { useWebAuthnForm } from './useWebAuthnForm';
import {
  useCheckNickname,
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

  const accountsRequest = useGetAccountsByHardwareId();

  const nicknames = useCheckNickname(search);

  const debouncedSearchHandler = useCallback(
    debounce((event: string | ChangeEvent<HTMLInputElement>) => {
      if (typeof event === 'string') {
        setSearch(event);
        nicknames;
        return;
      }
    }, 300),
    [],
  );

  const handleLogin = loginForm.handleSubmit(async ({ name }) => {
    const acc = accountsRequest?.data?.find((user) => user.id === name);

    if (acc) {
      const { code } = await UserService.generateSignInCode(acc.address);
      await signAccountMutate.mutateAsync({
        id: acc.webauthn.id,
        challenge: code,
        publicKey: acc.webauthn.publicKey,
      });
    }
  });

  const handleCreate = memberForm.handleSubmit(async ({ name }) => {
    await createAccountMutate.mutateAsync(name).catch((error) => {
      console.error(error);
    });
    accountsRequest.refetch();
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
      isDisabled:
        !memberForm.formState.isValid ||
        memberForm.watch('name').length === 0 ||
        nicknames.data?.name,
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
      isDisabled:
        !loginForm.formState.isValid || loginForm.watch('name').length === 0,
      title: 'Login with WebAuthn',
      description: 'Select your username to login',
    },
  };

  return {
    goToPage,
    setSearch,
    openWebAuthnDrawer,
    closeWebAuthnDrawer,
    accountsRequest,
    handleChangeTab,
    hardwareId: localStorage.getItem(localStorageKeys.HARDWARE_ID),
    checkNickname: useCheckNickname(search),
    nicknamesData: nicknames.data,
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
