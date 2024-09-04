import { useFuel } from '@fuels/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';
import { ENetworks } from '@/utils/constants';

import { TypeUser } from '../../services';
import { useQueryParams } from '../usePopup';
import { useCreateUserRequest, useSignInRequest } from '../useUserRequest';
import { SignInOrigin, useSignInOriginFactory } from './origin';

const useWalletSignIn = () => {
  const [isAnyWalletConnectorOpen, setIsAnyWalletConnectorOpen] =
    useState(false);

  const navigate = useNavigate();
  const { fuel } = useFuel();
  const { sessionId } = useQueryParams();
  const { authDetails, invalidateGifAnimationRequest } = useWorkspaceContext();

  const signInOrigin = sessionId ? SignInOrigin.DAPP : SignInOrigin.WEB;
  const { redirect } = useSignInOriginFactory(signInOrigin);

  const signInRequest = useSignInRequest({
    onSuccess: ({ accessToken, avatar, user_id, workspace, address }) => {
      authDetails.handlers.authenticate({
        userId: user_id,
        avatar: avatar!,
        account: address,
        accountType: TypeUser.FUEL,
        accessToken: accessToken,
        singleWorkspace: workspace.id,
        permissions: workspace.permissions,
      });
      invalidateGifAnimationRequest();
      navigate(redirect());
    },
  });

  const createUserRequest = useCreateUserRequest({
    onSuccess: ({ code, type }) => {
      signInRequest.mutate({
        code,
        type,
      });
    },
  });

  const handleSelectWallet = async (connector: string) => {
    const isWalletConnectorOpen = await fuel.selectConnector(connector);
    setIsAnyWalletConnectorOpen(isWalletConnectorOpen);
    await connect();
  };

  const connect = async () => {
    try {
      const connected = await fuel.connect();

      if (!connected) return;

      const network = await fuel.currentNetwork();
      const account = await fuel.currentAccount();

      if (network.url === ENetworks.BETA_5) {
        throw Error;
      }

      createUserRequest.mutate({
        address: account!,
        provider: network!.url,
        type: TypeUser.FUEL,
      });
      setIsAnyWalletConnectorOpen(false);
    } catch (e) {
      setIsAnyWalletConnectorOpen(false);
      authDetails.handlers.setInvalidAccount?.(true);
    }
  };

  useEffect(() => {
    const fueletConnectionStatus = () => (data: boolean) => {
      setIsAnyWalletConnectorOpen(data);
    };

    fuel.on(fuel.events.connection, fueletConnectionStatus());

    return () => {
      fuel.off(fuel.events.connection, fueletConnectionStatus);
    };
  }, [fuel]);

  return {
    handleSelectWallet,
    isAnyWalletConnectorOpen,
  };
};

export { useWalletSignIn };
