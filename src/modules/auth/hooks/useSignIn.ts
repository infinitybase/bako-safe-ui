import { useDisclosure } from '@chakra-ui/react';
import { useAccount, useFuel, useIsConnected } from '@fuels/react';
import { Location, useNavigate } from 'react-router-dom';

import { useQueryParams } from '@/modules/auth/hooks';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import {
  EConnectors,
  useDefaultConnectors,
} from '@/modules/core/hooks/fuel/useListConnectors';
import { Pages } from '@/modules/core/routes';

import { TypeUser } from '../services';
import { useCreateUserRequest, useSignInRequest } from './useUserRequest';
import { useWebAuthn } from './useWebAuthn';
import { useGetAccountsByHardwareId } from './useWebauthnRequests';

export const redirectPathBuilder = (
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
  const { openWebAuthnDrawer, isOpen, closeWebAuthnDrawer, page, setSearch } =
    useWebAuthn();

  const hasFuel = !!fuel;

  const signInRequest = useSignInRequest({
    onSuccess: ({ accessToken, avatar, user_id, workspace, webAuthn }) => {
      const _webAuthn = webAuthn ? { ...webAuthn } : undefined;
      auth.handlers.authenticate({
        userId: user_id,
        avatar: avatar!,
        account: account!,
        accountType: TypeUser.FUEL,
        accessToken: accessToken,
        singleWorkspace: workspace.id,
        permissions: workspace.permissions,
        webAuthn: _webAuthn,
      });
      navigate(redirectPathBuilder(!!origin, location, account!));
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

  const redirectToWalletLink = () =>
    window.open(import.meta.env.VITE_FUEL_WALLET_URL, '_BLANK');

  const selectConnector = async (connector: string) => {
    await fuel.selectConnector(connector);
    connectorDrawer.onClose();
    const isbyWallet =
      connector === EConnectors.FUEL || connector === EConnectors.FULLET;
    if (isbyWallet) {
      return connectByWallet();
    }

    openWebAuthnDrawer();
  };

  const connectByWallet = async () => {
    try {
      const connected = await fuel.connect();

      if (!connected) return;

      const network = await fuel.currentNetwork();
      const account = await fuel.currentAccount();

      createUserRequest.mutate({
        address: account!,
        provider: network!.url,
        type: account ? TypeUser.FUEL : TypeUser.WEB_AUTHN,
      });
    } catch (e) {
      auth.handlers.setInvalidAccount(true);
    }
  };

  return {
    auth,
    connectByWallet,
    webauthn: {
      page,
      isOpen,
      setSearch,
      closeWebAuthnDrawer,
      accounts: useGetAccountsByHardwareId(),
    },
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
