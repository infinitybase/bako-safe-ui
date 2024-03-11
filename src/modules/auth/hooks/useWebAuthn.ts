import debounce from 'lodash.debounce';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';

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
  const [searchRequest, setSearchRequest] = useState('');
  const [search, setSearch] = useState('');

  const tabs = useTab<WebAuthnState>({
    tabs: EnumUtils.toNumberArray(WebAuthnState),
    defaultTab: WebAuthnState.LOGIN,
  });

  const { memberForm, loginForm } = useWebAuthnForm();
  const { createAccountMutate, signAccountMutate } = useDrawerWebAuth();

  const accountsRequest = useGetAccountsByHardwareId();

  const nicknames = useCheckNickname(searchRequest);

  const debouncedSearchHandler = useCallback(
    debounce((value: string) => {
      setSearchRequest(value);
    }, 300),
    [],
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    debouncedSearchHandler(value);
  };

  const handleLogin = loginForm.handleSubmit(async ({ name }) => {
    const acc = accountsRequest?.data?.find(
      (user) => user.webauthn.id === name,
    );

    if (acc) {
      const { code } = await UserService.generateSignInCode(acc.address);
      await signAccountMutate.mutateAsync({
        id: acc.webauthn.id,
        challenge: code,
        publicKey: acc.webauthn.publicKey,
      });
    }
  });

  useEffect(() => {
    if (accountsRequest?.data?.length === 0) {
      tabs.set(WebAuthnState.REGISTER);
    }
  }, [accountsRequest.data]);

  const handleCreate = memberForm.handleSubmit(async ({ name }) => {
    await createAccountMutate
      .mutateAsync(name, {
        onSuccess: async (data) => {
          await accountsRequest.refetch();
          await tabs.set(WebAuthnState.LOGIN);
          loginForm.setValue('name', data.id);
          memberForm.reset();
        },
      })
      .catch((error) => {
        console.error(error);
      });
  });

  const handleChangeTab = (tab: WebAuthnState) => {
    tabs.set(tab);
  };

  const openWebAuthnDrawer = () => {
    setIsOpen(true);
  };

  const resetDialogForms = () => {
    handleChangeTab(WebAuthnState.LOGIN);
    loginForm.reset();
    memberForm.reset();
  };

  const closeWebAuthnDrawer = () => {
    setIsOpen(false);
    resetDialogForms();
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
      isDisabled: loginForm.watch('name')?.length === 0 ?? false,
      title: 'Login with WebAuthn',
      description: 'Select your username to login',
    },
  };

  return {
    goToPage,
    setSearch,
    resetDialogForms,
    openWebAuthnDrawer,
    closeWebAuthnDrawer,
    accountsRequest,
    handleChangeTab,
    hardwareId: localStorage.getItem(localStorageKeys.HARDWARE_ID),
    checkNickname: useCheckNickname(searchRequest),
    nicknamesData: nicknames.data,
    handleInputChange,
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
