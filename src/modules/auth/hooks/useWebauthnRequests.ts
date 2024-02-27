import { useMutation, UseMutationOptions, useQuery } from 'react-query';

import { localStorageKeys, UserQueryKey, UserService } from '../services';

const useCreateHardwareId = (
  options?: UseMutationOptions<unknown, unknown, string>,
) => {
  return useMutation(
    UserQueryKey.ACCOUNTS(localStorage.getItem(localStorageKeys.HARDWARE_ID)!),
    UserService.createHardwareId,
    options,
  );
};

const useCheckHardwareId = () => {
  return useQuery(
    UserQueryKey.ACCOUNTS(localStorage.getItem(localStorageKeys.HARDWARE_ID)!),
    () => UserService.getHardwareId(),
    {
      refetchOnWindowFocus: false,
      onSuccess: async (data) => {
        console.log('data', data);
        if (!data) {
          await UserService.createHardwareId();
        }
      },
    },
  );
};

const useCheckNickname = (nickname: string) => {
  return useQuery(
    UserQueryKey.NICKNAME(nickname),
    () => UserService.verifyNickname(nickname),
    {
      refetchOnWindowFocus: false,
    },
  );
};

const useGetAccountsByHardwareId = (hardwareId: string) => {
  return useQuery(
    UserQueryKey.ACCOUNTS(hardwareId),
    () => UserService.getByHardwareId(hardwareId),
    {
      refetchOnWindowFocus: false,
      enabled: !!hardwareId,
    },
  );
};

export {
  useCheckHardwareId,
  useCheckNickname,
  useCreateHardwareId,
  useGetAccountsByHardwareId,
};
