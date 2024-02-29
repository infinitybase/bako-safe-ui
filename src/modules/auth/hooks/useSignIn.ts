import { useDisclosure } from '@chakra-ui/react';
import { useAccount, useFuel, useIsConnected } from '@fuels/react';
import { Location, useNavigate } from 'react-router-dom';

import { useQueryParams } from '@/modules/auth/hooks';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useDefaultConnectors } from '@/modules/core/hooks/fuel/useListConnectors';
import { Pages } from '@/modules/core/routes';

import { useCreateUserRequest, useSignInRequest } from './useUserRequest';

const redirectPathBuilder = (
  isDapp: boolean,
  location: Location,
  account: string,
) => {
  const isRedirectToPrevious = !!location.state?.from;

  if (isDapp && isRedirectToPrevious) {
    return location.state.from;
  }

  if (isDapp) {
    return `${Pages.dappAuth()}${location.search}&address=${account}`;
  }

  return Pages.home();
};

const useSignIn = () => {
  const navigate = useNavigate();
  const connectorDrawer = useDisclosure();

  const { fuel } = useFuel();
  const auth = useAuth();
  const { isConnected } = useIsConnected();
  const { account } = useAccount();
  const { location, origin } = useQueryParams();

  const { connectors } = useDefaultConnectors();

  const hasFuel = !!fuel;

  const signInRequest = useSignInRequest({
    onSuccess: ({ accessToken, avatar, user_id, workspace }) => {
      auth.handlers.authenticate({
        userId: user_id,
        avatar: avatar!,
        account: account!,
        accessToken: accessToken,
        singleWorkspace: workspace.id,
        permissions: workspace.permissions,
      });
      navigate(redirectPathBuilder(!!origin, location, account!));
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

  const redirectToWalletLink = () =>
    window.open(import.meta.env.VITE_FUEL_WALLET_URL, '_BLANK');

  const selectConnector = async (connector: string) => {
    await fuel.selectConnector(connector);
    connectorDrawer.onClose();
    goToApp();
  };

  const goToApp = async () => {
    try {
      const connected = await fuel.connect();

      if (!connected) return;

      const network = await fuel.currentNetwork();
      const account = await fuel.currentAccount();

      createUserRequest.mutate({
        address: account!,
        provider: network!.url,
      });
    } catch (e) {
      auth.handlers.setInvalidAccount(true);
    }
  };

  return {
    auth,
    goToApp,
    signInRequest,
    isConnected,
    isConnecting: signInRequest.isLoading || createUserRequest.isLoading,
    createUserRequest,
    connectors: {
      items: connectors,
      drawer: connectorDrawer,
      select: selectConnector,
      has: !!connectors?.length,
    },
    hasFuel,
    redirectToWalletLink,
  };
};

export { useSignIn };
