import { useMutation, useQuery } from '@tanstack/react-query';

import { userService } from '@/config/services-initializer';

import { localStorageKeys, UserQueryKey } from '../../utils';

const useCheckNickname = (
  nickname: string,
  enabled: boolean,
  userId?: string,
) => {
  return useQuery({
    queryKey: UserQueryKey.NICKNAME(nickname, userId),
    queryFn: () => userService.verifyNickname(nickname, userId),
    refetchOnWindowFocus: false,
    enabled,
  });
};

const useGetAccountsByHardwareId = () => {
  let hardwareId: string | null = null;
  const validPath = window.location.pathname === '/';
  hardwareId = localStorage.getItem(localStorageKeys.HARDWARE_ID);
  if (!hardwareId || hardwareId == null) {
    hardwareId = crypto.randomUUID();
    localStorage.setItem(localStorageKeys.HARDWARE_ID, hardwareId);
  }

  return useQuery({
    queryKey: UserQueryKey.ACCOUNTS(hardwareId),
    queryFn: () => userService.getByHardwareId(hardwareId!),
    refetchOnWindowFocus: false,
    enabled: !!hardwareId && validPath,
  });
};

const useSignMessageWebAuthn = () => {
  return useMutation({
    mutationKey: UserQueryKey.SIGN_MESSAGE_WEB_AUTHN(),
    mutationFn: userService.signMessageWebAuthn,
  });
};

const useCreateWebAuthnAccount = () => {
  return useMutation({
    mutationKey: UserQueryKey.CREATE_WEB_AUTHN_ACCOUNT(),
    mutationFn: userService.createWebAuthnAccount,
  });
};

export {
  useCheckNickname,
  useCreateWebAuthnAccount,
  useGetAccountsByHardwareId,
  useSignMessageWebAuthn,
};
