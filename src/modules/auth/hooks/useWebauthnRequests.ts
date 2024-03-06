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
  let hardwareId = undefined;
  hardwareId = localStorage.getItem(localStorageKeys.HARDWARE_ID);
  if (!hardwareId) {
    hardwareId = crypto.randomUUID();
    localStorage.setItem(localStorageKeys.HARDWARE_ID, hardwareId);
  }
  return useQuery(
    UserQueryKey.ACCOUNTS(hardwareId),
    () => UserService.getByHardwareId(hardwareId),
    {
      refetchOnWindowFocus: false,
      enabled: !!hardwareId,
    },
  );
};

export { useCheckNickname, useGetAccountsByHardwareId };
