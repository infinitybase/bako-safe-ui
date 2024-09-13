import debounce from 'lodash.debounce';
import { useCallback, useMemo, useState } from 'react';

import {
  useCheckNickname,
  useGetAccountsByHardwareId,
} from './useWebauthnRequests';

const useWebAuthnInput = () => {
  const [inputValue, setInputValue] = useState('');
  const [accountSearch, setAccountSearch] = useState('');
  const [accountFilter, setAccountFilter] = useState('');

  const accountsRequest = useGetAccountsByHardwareId();
  const checkNicknameRequest = useCheckNickname(accountSearch);

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

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    debouncedAccountSearch(newValue);
    debouncedAccountFilter(newValue);
  };

  return {
    inputValue,
    accountsOptions,
    debouncedAccountFilter,
    accountsRequest,
    checkNicknameRequest,
    setInputValue,
    handleInputChange,
  };
};

export { useWebAuthnInput };
