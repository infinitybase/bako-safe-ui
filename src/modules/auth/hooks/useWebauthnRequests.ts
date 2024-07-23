import { useQuery } from '@tanstack/react-query';

import { localStorageKeys, UserQueryKey, UserService } from '../services';

const useCheckNickname = (nickname: string) => {
  return useQuery({
    queryKey: UserQueryKey.NICKNAME(nickname),
    queryFn: () => UserService.verifyNickname(nickname),
    refetchOnWindowFocus: false,
  });
};

const useGetAccountsByHardwareId = () => {
  let hardwareId: string | null = null;
  hardwareId = localStorage.getItem(localStorageKeys.HARDWARE_ID);
  if (!hardwareId || hardwareId == null) {
    hardwareId = crypto.randomUUID();
    localStorage.setItem(localStorageKeys.HARDWARE_ID, hardwareId);
  }
  return useQuery({
    queryKey: UserQueryKey.ACCOUNTS(hardwareId),
    queryFn: () => UserService.getByHardwareId(hardwareId!),
    refetchOnWindowFocus: false,
    enabled: !!hardwareId,
  });
};

export { useCheckNickname, useGetAccountsByHardwareId };
