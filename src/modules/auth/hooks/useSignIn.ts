import { useNavigate } from 'react-router-dom';

import { CookieName, CookiesConfig } from '@/config/cookies';
import { useFuelAccount } from '@/modules';
import {
  Pages,
  useConnect,
  useCurrentAccount,
  useIsConnected,
  useProvider,
} from '@/modules/core';

import { useCreateUserRequest, useSignInRequest } from './useUserRequest';

const useSignIn = () => {
  const navigate = useNavigate();

  const { setAccount, setAvatar } = useFuelAccount();
  const { isConnected } = useIsConnected();
  const { connect, isConnecting } = useConnect();
  const { account } = useCurrentAccount();
  const { provider } = useProvider();

  const signInRequest = useSignInRequest({
    onSuccess: ({ accessToken, avatar }) => {
      CookiesConfig.setCookies([
        {
          name: CookieName.ACCESS_TOKEN,
          value: accessToken,
        },
        {
          name: CookieName.ADDRESS,
          value: account!,
        },
        {
          name: CookieName.AVATAR,
          value: avatar!,
        },
      ]);
      setAccount(account!);
      setAvatar(avatar!);
      navigate(Pages.home());
    },
  });

  const createUserRequest = useCreateUserRequest({
    onSuccess: ({ address, id, provider }) => {
      signInRequest.mutate({
        address,
        provider,
        user_id: id,
        avatar: '',
      });
    },
  });

  const goToApp = async () => {
    try {
      const connected = await connect();

      if (!connected) return;

      createUserRequest.mutate({
        address: account!,
        provider: provider!.url,
      });
    } catch (e) {
      console.log({ e });
    }
  };

  return {
    connect,
    goToApp,
    signInRequest,
    isConnected,
    isConnecting:
      isConnecting || signInRequest.isLoading || createUserRequest.isLoading,
    createUserRequest,
  };
};

export { useSignIn };
