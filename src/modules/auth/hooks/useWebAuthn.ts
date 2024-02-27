import debounce from 'lodash.debounce';
import { ChangeEvent, useCallback, useState } from 'react';

import { EnumUtils, useTab } from '@/modules/core';

import { SignWebAuthnPayload } from '../services';
import { useDrawerWebAuth } from './useDrawerWebAuthn';
import { useWebAuthnForm } from './useWebAuthnForm';
import {
  useCheckHardwareId,
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
  const [sign, setSign] = useState<SignWebAuthnPayload>({
    id: '',
    challenge: '',
    publicKey: '',
  });

  const tabs = useTab<WebAuthnState>({
    tabs: EnumUtils.toNumberArray(WebAuthnState),
    defaultTab: WebAuthnState.LOGIN,
  });
  const { memberForm, loginForm } = useWebAuthnForm();
  const { createAccountMutate, signAccountMutate } = useDrawerWebAuth();

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
    if (name) {
      await signAccountMutate
        .mutateAsync(sign)
        .then((data) => console.log(data));
    }
  });

  const handleCreate = memberForm.handleSubmit(async ({ name }) => {
    await createAccountMutate
      .mutateAsync(name)
      .then((data) => {
        setSign({
          id: data.id,
          challenge: data.code,
          publicKey: data.publicKey,
        });
        tabs.set(WebAuthnState.LOGIN);
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
    useGetAccountsByHardwareId,
    handleChangeTab,
    hardwareId: useCheckHardwareId().data,
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
