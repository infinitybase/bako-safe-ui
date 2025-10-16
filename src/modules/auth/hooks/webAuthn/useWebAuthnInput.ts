import { useCallback, useMemo, useState } from 'react';

import { AutocompleteBadgeStatus } from '@/components/autocomplete';
import { LocalStorageConfig } from '@/config';
import { useDebounce } from '@/modules/core';

import { localStorageKeys, TypeUser } from '../../services/methods';
import { WebAuthnModeState } from '../signIn';
import {
  useCheckNickname,
  useGetAccountsByHardwareId,
} from './useWebauthnRequests';

interface IWebauthnInputBadge {
  status: AutocompleteBadgeStatus;
  label: string;
}

const WebauthnInputBadge: Record<string, IWebauthnInputBadge> = {
  SEARCHING: {
    status: AutocompleteBadgeStatus.SEARCHING,
    label: 'Searching...',
  },
  INFO: { status: AutocompleteBadgeStatus.INFO, label: 'Username found' },
  SUCCESS: {
    status: AutocompleteBadgeStatus.SUCCESS,
    label: 'Username available',
  },
  ERROR: { status: AutocompleteBadgeStatus.ERROR, label: 'Invalid username' },
  CONFLICT: {
    status: AutocompleteBadgeStatus.CONFLICT,
    label: 'This username is already in use',
  },
};

const useWebAuthnInput = (
  validUsername?: boolean,
  userId?: string,
  mode?: WebAuthnModeState,
) => {
  const [inputValue, setInputValue] = useState<string>('');
  const debouncedInputValue = useDebounce(inputValue, 400);

  const accountsRequest = useGetAccountsByHardwareId();

  const checkNicknameRequestEnabled = !!validUsername && !!debouncedInputValue;
  const checkNicknameRequest = useCheckNickname(
    debouncedInputValue,
    checkNicknameRequestEnabled,
    userId,
  );

  const mergedAccounts = useMemo(() => {
    const localAccounts = LocalStorageConfig.getItem<string[]>(
      localStorageKeys.USERNAMES,
    );
    return [
      ...(localAccounts || []),
      ...(accountsRequest.data?.map((name) => name.name) || []),
    ].filter(
      (account, index, self) => self.findIndex((a) => a === account) === index,
    );
  }, [accountsRequest.data]);

  const accountsOptions = useMemo(() => {
    const filteredAccounts = mergedAccounts?.filter((account) =>
      account.toLowerCase().includes(debouncedInputValue.toLowerCase()),
    );

    const mappedOptions = filteredAccounts?.map((account) => ({
      label: account,
      value: account,
    }));

    return mappedOptions;
  }, [mergedAccounts, debouncedInputValue]);

  const handleInputChange = useCallback((newValue: string) => {
    setInputValue(newValue);
  }, []);

  const badge: IWebauthnInputBadge | undefined = useMemo(() => {
    if (!debouncedInputValue) {
      return undefined;
    }

    if (checkNicknameRequest.isLoading) {
      return WebauthnInputBadge.SEARCHING;
    }

    if (mode === WebAuthnModeState.LOGIN) {
      if (checkNicknameRequest.data?.type === TypeUser.WEB_AUTHN) {
        return WebauthnInputBadge.INFO;
      }
      return WebauthnInputBadge.ERROR;
    }

    if (mode === WebAuthnModeState.REGISTER) {
      if (checkNicknameRequest.data?.type === TypeUser.WEB_AUTHN) {
        return WebauthnInputBadge.CONFLICT;
      }
      return WebauthnInputBadge.SUCCESS;
    }
  }, [
    checkNicknameRequest.isLoading,
    checkNicknameRequest.data,
    mode,
    debouncedInputValue,
  ]);

  return {
    inputValue,
    accountsOptions,
    accountsRequest,
    checkNicknameRequest,
    badge,
    setInputValue,
    handleInputChange,
  };
};

export { useWebAuthnInput };
