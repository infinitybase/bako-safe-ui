import debounce from 'lodash.debounce';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { WebAuthnInputBadgeStatus } from '../../components/webAuthn/input';
import { TypeUser } from '../../services/methods';
import {
  useCheckNickname,
  useGetAccountsByHardwareId,
} from './useWebauthnRequests';

const useWebAuthnInput = (validUsername: boolean) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [accountSearch, setAccountSearch] = useState<string>('');
  const [accountFilter, setAccountFilter] = useState<string>('');
  const [badgeLabel, setBadgeLabel] = useState<string>('');
  const [badgeStatus, setBadgeStatus] = useState<
    WebAuthnInputBadgeStatus | undefined
  >(undefined);

  const accountsRequest = useGetAccountsByHardwareId();

  const checkNicknameRequestEnabled = validUsername && !!accountSearch;
  const checkNicknameRequest = useCheckNickname(
    accountSearch,
    checkNicknameRequestEnabled,
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

  const handleBadgeChange = useCallback(
    (newStatus: WebAuthnInputBadgeStatus, newLabel: string) => {
      setBadgeStatus(newStatus);
      setBadgeLabel(newLabel);
    },
    [],
  );

  useEffect(() => {
    if (checkNicknameRequest.isLoading) {
      handleBadgeChange(WebAuthnInputBadgeStatus.SEARCHING, 'Searching...');
    } else if (!validUsername) {
      handleBadgeChange(WebAuthnInputBadgeStatus.ERROR, 'Invalid username');
    } else if (checkNicknameRequest.data?.type === TypeUser.WEB_AUTHN) {
      handleBadgeChange(WebAuthnInputBadgeStatus.INFO, 'Account found');
    } else if (checkNicknameRequest.isSuccess) {
      handleBadgeChange(WebAuthnInputBadgeStatus.SUCCESS, 'Available');
    }
  }, [
    checkNicknameRequest.data?.type,
    checkNicknameRequest.isLoading,
    checkNicknameRequest.isSuccess,
    validUsername,
    handleBadgeChange,
  ]);

  return {
    inputValue,
    accountsOptions,
    debouncedAccountFilter,
    accountsRequest,
    checkNicknameRequest,
    badge: {
      status: badgeStatus,
      label: badgeLabel,
    },
    setInputValue,
    handleInputChange,
  };
};

export { useWebAuthnInput };
