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

  const { setAccount } = useFuelAccount();
  const { isConnected } = useIsConnected();
  const { connect, isConnecting } = useConnect();
  const { account } = useCurrentAccount();
  const { provider } = useProvider();

  const signInRequest = useSignInRequest({
    onSuccess: ({ accessToken }) => {
      CookiesConfig.setCookies([
        {
          name: CookieName.ACCESS_TOKEN,
          value: accessToken,
        },
      ]);
      setAccount(account!);
      navigate(
        Pages.detailsVault({ vaultId: '5e858bcd-15a3-4c2d-872b-9bd296151887' }),
      );
    },
  });

  const createUserRequest = useCreateUserRequest({
    onSuccess: ({ address, id, provider }) => {
      signInRequest.mutate({
        address,
        provider,
        user_id: id,
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
