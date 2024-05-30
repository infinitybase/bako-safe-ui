import debounce from 'lodash.debounce';
import {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { EnumUtils, useTab } from '@/modules/core';

import { localStorageKeys, UserService } from '../services';
import { useDrawerWebAuth } from './useDrawerWebAuthn';
import { useWebAuthnForm } from './useWebAuthnForm';
import { useWebAuthnLastLogin } from './useWebAuthnLastLogin';
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
  const [searchAccount, setSearchAccount] = useState('');
  //button sign in disabled, this is used because handleLogin proccess annoter info before mutation to use isLoading
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [signInProgress, setSignInProgress] = useState(0);

  const tabs = useTab<WebAuthnState>({
    tabs: EnumUtils.toNumberArray(WebAuthnState),
    defaultTab: WebAuthnState.LOGIN,
  });

  const accountsRequest = useGetAccountsByHardwareId();
  const { lastLoginUsername, setLastLoginUsername } = useWebAuthnLastLogin();
  const { memberForm, loginForm } = useWebAuthnForm();
  const { createAccountMutate, signAccountMutate } = useDrawerWebAuth();

  const accountsOptions = useMemo(() => {
    const filteredAccounts = accountsRequest.data?.filter((account) =>
      account.name.toLowerCase().includes(searchAccount.toLowerCase()),
    );

    const mappedOptions = filteredAccounts?.map((account) => ({
      label: account.name,
      value: account.webauthn.id,
    }));

    return mappedOptions;
  }, [accountsRequest.data, searchAccount]);

  const nicknames = useCheckNickname(searchRequest);

  const currentUsername = loginForm.watch('name');

  const debouncedSearchAccount = useCallback(
    debounce((value: string) => {
      setSearchAccount(value);
    }, 300),
    [],
  );

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

  const loginBtnIsDisabled = useMemo(
    () =>
      !loginForm.formState.isValid ||
      (currentUsername?.length === 0 ?? false) ||
      btnDisabled,
    [btnDisabled, currentUsername?.length, loginForm.formState.isValid],
  );

  const handleLogin = loginForm.handleSubmit(async ({ name }) => {
    setBtnDisabled(true);
    setIsSigningIn(true);

    const acc = await UserService.verifyNickname(name);

    if (!acc?.address || !acc.webauthn) {
      loginForm.setError('name', {
        message:
          'Username not found, please check your username or create an account.',
      });

      setSignInProgress(0);
      setBtnDisabled(false);
      setIsSigningIn(false);
      return;
    }

    setSignInProgress(33);

    const { code } = await UserService.generateSignInCode(acc.address);

    setSignInProgress(66);

    await signAccountMutate.mutateAsync(
      {
        id: acc.webauthn.id,
        challenge: code,
        publicKey: acc.webauthn.publicKey,
      },
      {
        onError: () => {
          setSignInProgress(0);
          setIsSigningIn(false);
          setBtnDisabled(false);
        },
        onSuccess: () => {
          setSignInProgress(100);
          setTimeout(() => {
            setIsSigningIn(false);
            setBtnDisabled(false);
            setLastLoginUsername(name);
          }, 800);
        },
      },
    );
  });

  const handleLoginUsingEnterKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loginBtnIsDisabled) {
      handleLogin();
    }
  };

  useEffect(() => {
    if (accountsRequest?.data?.length === 0) {
      tabs.set(WebAuthnState.REGISTER);
    }
  }, [accountsRequest.data, isOpen]);

  const createBtnIsDisabled =
    !memberForm.formState.isValid ||
    memberForm.watch('name').length === 0 ||
    nicknames.data?.name;

  const handleCreate = memberForm.handleSubmit(async ({ name }) => {
    await createAccountMutate
      .mutateAsync(name, {
        onSuccess: async () => {
          await accountsRequest.refetch();
          await tabs.set(WebAuthnState.LOGIN);
          loginForm.reset({ name: name });
          memberForm.reset();
          setSearch('');
        },
      })
      .catch((error) => {
        console.error(error);
      });
  });

  const handleCreateUsingEnterKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !createBtnIsDisabled) {
      handleCreate();
    }
  };

  const handleChangeTab = (tab: WebAuthnState) => {
    tabs.set(tab);
  };

  const openWebAuthnDrawer = () => {
    setIsOpen(true);
  };

  const resetDialogForms = () => {
    handleChangeTab(WebAuthnState.LOGIN);
    loginForm.reset({ name: lastLoginUsername ?? '' });
    memberForm.reset({ name: search }, { keepErrors: true });
  };

  const closeWebAuthnDrawer = () => {
    setIsOpen(false);
    resetDialogForms();
  };

  const goToPage = (page: WebAuthnState) => {
    setPage(page);
  };

  useEffect(() => {
    debouncedSearchAccount(currentUsername);
  }, [currentUsername, debouncedSearchAccount]);

  useEffect(() => {
    loginForm.setValue('name', lastLoginUsername ?? '');
  }, [lastLoginUsername, loginForm]);

  const formState = {
    [WebAuthnState.REGISTER]: {
      isValid: memberForm.formState.isValid,
      primaryAction: 'Create account',
      secondaryAction: 'Cancel',
      handlePrimaryAction: handleCreate,
      handlePrimaryActionUsingEnterKey: handleCreateUsingEnterKey,
      handleSecondaryAction: resetDialogForms,
      isLoading: createAccountMutate.isLoading,
      isDisabled: createBtnIsDisabled,
      title: 'Create Passkey account',
      description: 'Create a new account for this device.',
    },
    [WebAuthnState.LOGIN]: {
      isValid: true,
      primaryAction: isSigningIn ? 'Signing in...' : 'Sign in',
      secondaryAction: 'Create account',
      handlePrimaryAction: handleLogin,
      handlePrimaryActionUsingEnterKey: handleLoginUsingEnterKey,
      handleSecondaryAction: () => handleChangeTab(WebAuthnState.REGISTER),
      isLoading: signAccountMutate.isLoading,
      isDisabled: loginBtnIsDisabled,
      title: 'Login with Passkey',
      description:
        'Select your username or create a new account for this device.',
    },
  };

  return {
    goToPage,
    setSearch,
    resetDialogForms,
    openWebAuthnDrawer,
    closeWebAuthnDrawer,
    accountsRequest,
    accountsOptions,
    handleChangeTab,
    hardwareId: localStorage.getItem(localStorageKeys.HARDWARE_ID),
    checkNickname: useCheckNickname(searchRequest),
    nicknamesData: nicknames.data,
    handleInputChange,
    isOpen,
    search,
    searchAccount: { value: searchAccount, handler: debouncedSearchAccount },
    page,
    form: {
      memberForm,
      loginForm,
      formState: formState[tabs.tab],
    },
    tabs,
    signIn: {
      progess: signInProgress,
      inProgress: isSigningIn,
    },
  };
};

export { useWebAuthn };
