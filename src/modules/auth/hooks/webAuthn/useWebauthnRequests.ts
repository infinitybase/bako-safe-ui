import { useMutation, useQuery } from '@tanstack/react-query';

import { localStorageKeys, UserQueryKey, UserService } from '../../services';

const useCheckNickname = (nickname: string) => {
  return useQuery({
    queryKey: UserQueryKey.NICKNAME(nickname),
    queryFn: () => UserService.verifyNickname(nickname),
    refetchOnWindowFocus: false,
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
    queryFn: () => UserService.getByHardwareId(hardwareId!),
    refetchOnWindowFocus: false,
    enabled: !!hardwareId && validPath,
  });
};

const useSignMessageWebAuthn = () => {
  return useMutation({
    mutationKey: UserQueryKey.SIGN_MESSAGE_WEB_AUTHN(),
    mutationFn: UserService.signMessageWebAuthn,
  });
};

const useCreateWebAuthnAccount = () => {
  return useMutation({
    mutationKey: UserQueryKey.CREATE_WEB_AUTHN_ACCOUNT(),
    mutationFn: UserService.createWebAuthnAccount,
  });
};

export {
  useCheckNickname,
  useCreateWebAuthnAccount,
  useGetAccountsByHardwareId,
  useSignMessageWebAuthn,
};
