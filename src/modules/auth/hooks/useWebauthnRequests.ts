import { useQuery } from 'react-query';

import { localStorageKeys, UserQueryKey, UserService } from '../services';

const useCheckNickname = (nickname: string) => {
  return useQuery(
    UserQueryKey.NICKNAME(nickname),
    () => UserService.verifyNickname(nickname),
    {
      refetchOnWindowFocus: false,
    },
  );
};

const useGetAccountsByHardwareId = () => {
  let hardwareId: string | null = null;
  hardwareId = localStorage.getItem(localStorageKeys.HARDWARE_ID);
  if (!hardwareId || hardwareId == null) {
    hardwareId = crypto.randomUUID();
    localStorage.setItem(localStorageKeys.HARDWARE_ID, hardwareId);
  }
  return useQuery(
    UserQueryKey.ACCOUNTS(hardwareId),
    () => UserService.getByHardwareId(hardwareId!),
    {
      refetchOnWindowFocus: false,
      enabled: !!hardwareId,
    },
  );
};

const useGetUserByWebAuthnId = (webAuthnId: string) => {
  return useQuery(
    UserQueryKey.ACCOUNTS(webAuthnId),
    () => UserService.getByWebAuthnId(webAuthnId),
    {
      refetchOnWindowFocus: false,
      enabled: !!webAuthnId,
    },
  );
};

export { useCheckNickname, useGetAccountsByHardwareId, useGetUserByWebAuthnId };
