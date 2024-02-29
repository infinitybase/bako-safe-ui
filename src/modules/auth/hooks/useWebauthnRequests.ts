import { useMutation, UseMutationOptions, useQuery } from 'react-query';

import { UserQueryKey, UserService } from '../services';

const useCreateHardwareId = (
  options?: UseMutationOptions<unknown, unknown, string>,
) => {
  return useMutation(
    UserQueryKey.HARDWARE_ID(),
    UserService.createHardwareId,
    options,
  );
};

const useCheckHardwareId = () => {
  return useQuery(
    UserQueryKey.HARDWARE_ID(),
    () => UserService.getHardwareId(),
    {
      refetchOnWindowFocus: false,
      onSuccess: async (data) => {
        if (!data) {
          await UserService.createHardwareId();
          UserQueryKey.HARDWARE_ID();
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
    },
  );
};

export {
  useCheckHardwareId,
  useCheckNickname,
  useCreateHardwareId,
  useGetAccountsByHardwareId,
};
