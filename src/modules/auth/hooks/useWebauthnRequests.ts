import { useQuery } from 'react-query';

import { localStorageKeys, UserQueryKey, UserService } from '../services';
import { useAuth } from './useAuth';

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
  const { account } = useAuth();
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
      enabled: !!hardwareId && !account,
    },
  );
};

export { useCheckNickname, useGetAccountsByHardwareId };
