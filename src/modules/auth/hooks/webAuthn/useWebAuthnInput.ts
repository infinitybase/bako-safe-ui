import debounce from 'lodash.debounce';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { AutocompleteBadgeStatus } from '@/components/autocomplete';

import { TypeUser } from '../../services/methods';
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
  INFO: { status: AutocompleteBadgeStatus.INFO, label: 'Account found' },
  SUCCESS: { status: AutocompleteBadgeStatus.SUCCESS, label: 'Available' },
  ERROR: { status: AutocompleteBadgeStatus.ERROR, label: 'Invalid username' },
};

const useWebAuthnInput = (validUsername?: boolean, userId?: string) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [accountSearch, setAccountSearch] = useState<string>('');
  const [accountFilter, setAccountFilter] = useState<string>('');
  const [badge, setBadge] = useState<IWebauthnInputBadge | undefined>(
    undefined,
  );

  const accountsRequest = useGetAccountsByHardwareId();

  const checkNicknameRequestEnabled = !!validUsername && !!accountSearch;
  const checkNicknameRequest = useCheckNickname(
    accountSearch,
    checkNicknameRequestEnabled,
    userId,
  );

  const accountsOptions = useMemo(() => {
    const filteredAccounts = accountsRequest.data?.filter((account) =>
      account.name.toLowerCase().includes(accountFilter.toLowerCase()),
    );

    const mappedOptions = filteredAccounts?.map((account) => ({
      label: account.name,
      value: account.webauthn.id,
    }));

    return mappedOptions;
  }, [accountsRequest.data, accountFilter]);

  const debouncedAccountFilter = useCallback(
    debounce((value: string) => {
      setAccountFilter(value);
    }, 300),
    [],
  );

  const debouncedAccountSearch = useCallback(
    debounce((value: string) => {
      setAccountSearch(value);
    }, 300),
    [],
  );

  const handleInputChange = useCallback((newValue: string) => {
    setInputValue(newValue);
    debouncedAccountSearch(newValue);
    debouncedAccountFilter(newValue);
  }, []);

  useEffect(() => {
    if (checkNicknameRequest.isLoading) {
      setBadge(WebauthnInputBadge.SEARCHING);
    } else if (!validUsername) {
      setBadge(WebauthnInputBadge.ERROR);
    } else if (checkNicknameRequest.data?.type === TypeUser.WEB_AUTHN) {
      setBadge(WebauthnInputBadge.INFO);
    } else if (checkNicknameRequest.isSuccess) {
      setBadge(WebauthnInputBadge.SUCCESS);
    }
  }, [
    checkNicknameRequest.data?.type,
    checkNicknameRequest.isLoading,
    checkNicknameRequest.isSuccess,
    validUsername,
  ]);

  return {
    inputValue,
    accountsOptions,
    debouncedAccountFilter,
    accountsRequest,
    checkNicknameRequest,
    badge,
    setInputValue,
    handleInputChange,
  };
};

export { useWebAuthnInput };
