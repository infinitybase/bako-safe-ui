import debounce from 'lodash.debounce';
import { ChangeEvent, useCallback, useState } from 'react';

import {
  useCheckHardwareId,
  useCheckNickname,
  useCreateHardwareId,
  useGetAccountsByHardwareId,
} from './useWebauthnRequests';

export enum EWebauthn {
  HOME = 0,
  REGISTER = 1,
  LOGIN = 2,
}

const useWebAuthn = () => {
  //drawer for webauthn
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(EWebauthn.HOME);
  const [search, setSearch] = useState('');

  const debouncedSearchHandler = useCallback(
    debounce((event: string | ChangeEvent<HTMLInputElement>) => {
      if (typeof event === 'string') {
        setSearch(event);
        return;
      }

      setSearch(event.target.value);
    }, 300),
    [],
  );

  const openWebAuthnDrawer = () => {
    setIsOpen(true);
  };
  const closeWebAuthnDrawer = () => {
    setIsOpen(false);
  };

  const goToPage = (page: EWebauthn) => {
    setPage(page);
  };

  return {
    goToPage,
    setSearch,
    openWebAuthnDrawer,
    closeWebAuthnDrawer,
    useCreateHardwareId,
    useGetAccountsByHardwareId,
    hardwareId: useCheckHardwareId().data,
    checkNickname: useCheckNickname(search),
    debouncedSearchHandler,
    isOpen,
    search,
    page,
  };
};

export { useWebAuthn };
