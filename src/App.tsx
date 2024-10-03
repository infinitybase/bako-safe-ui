import { useFuel } from '@fuels/react';
import { TypeUser } from 'bakosafe';
import { Address } from 'fuels';
import { useEffect } from 'react';

import { AppRoutes } from '@/routes';

import { invalidateQueries } from './modules/core/utils';
import { useNetworks } from './modules/network/hooks';
import { useWorkspaceContext } from './modules/workspace/WorkspaceProvider';

function App() {
  const { fuel } = useFuel();
  const { authDetails: auth } = useWorkspaceContext();
  const { handleSelectNetwork, currentNetwork } = useNetworks();

  useEffect(() => {
    console.log(`🚀 useEffect`);

    async function clearAll() {
      auth.handlers.logout?.();
      invalidateQueries();
    }

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

    return () => {
      fuel.off(fuel.events.connection, onConnection);
      fuel.off(fuel.events.currentAccount, onCurrentAccount);
    };
  }, [auth]);

  useEffect(() => {
    fuel.on(fuel.events.currentNetwork, async (url: { url: string }) => {
      console.log(`🚀 fuel.on`);
      if (url.url === currentNetwork.url) return;
      await handleSelectNetwork(url.url);
    });
  }, []);

  return <AppRoutes />;
}

export default App;
