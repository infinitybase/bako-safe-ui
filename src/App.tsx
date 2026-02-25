import { useFuel } from '@fuels/react';
import { TypeUser } from 'bakosafe';
import { Address } from 'fuels';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { AppRoutes } from '@/routes';

import { invalidateQueries } from './modules/core/utils';
import { useNetworks } from './modules/network/hooks';
import { useWorkspaceContext } from './modules/workspace/hooks';

function App() {
  const { fuel } = useFuel();
  const { authDetails: auth } = useWorkspaceContext();
  const { handleSelectNetwork } = useNetworks();

  const { pathname } = useLocation();
  const isWebAuthn = auth.userInfos?.type?.type === TypeUser.WEB_AUTHN;

  useEffect(() => {
    async function clearAll() {
      auth.handlers.logout?.();
      invalidateQueries();
    }

    const changeNetwork = async (url: { url: string }) => {
      if (pathname !== '/' && !isWebAuthn) await handleSelectNetwork(url.url);
    };

    function onConnection(isConnected: boolean) {
      if (isConnected) return;
      clearAll();
    }

    function onCurrentAccount(currentAccount: string) {
      const parsedCurrentAccount = Address.fromString(currentAccount).toB256();
      if (
        parsedCurrentAccount ===
          Address.fromString(auth.userInfos?.address).toB256() ||
        auth.userInfos?.type?.type !== TypeUser.FUEL
      )
        return;
      clearAll();
    }

    fuel.on(fuel.events.connection, onConnection);
    fuel.on(fuel.events.currentAccount, onCurrentAccount);
    fuel.on(fuel.events.currentNetwork, changeNetwork);

    return () => {
      fuel.off(fuel.events.connection, onConnection);
      fuel.off(fuel.events.currentAccount, onCurrentAccount);
      fuel.off(fuel.events.currentNetwork, changeNetwork);
    };
  }, [auth]);

  return <AppRoutes />;
}

export default App;
