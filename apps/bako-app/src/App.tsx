import { useFuel } from '@fuels/react';
import { TypeUser } from 'bakosafe';
import { Address } from 'fuels';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { AppRoutes } from '@/routes';

import { setupAxiosInterceptors } from './config';
import { useAuth, useAuthUrlParams } from './modules';
import AuthProvider from './modules/auth/AuthProvider';
import { invalidateQueries } from './modules/core/utils';
import { useNetworks } from './modules/network/hooks';
import TransactionsProvider from './modules/transactions/providers/TransactionsProvider';
import WorkspaceProvider from './modules/workspace/WorkspaceProvider';

function App() {
  const { fuel } = useFuel();
  const { handleSelectNetwork } = useNetworks();

  const auth = useAuth();
  const { pathname } = useLocation();
  const isWebAuthn = auth.userInfos?.type === TypeUser.WEB_AUTHN;

  const [isTokenExpired, setIsTokenExpired] = useState(false);

  const { isTxFromDapp } = useAuthUrlParams();
  useMemo(() => {
    setupAxiosInterceptors({
      isTxFromDapp,
      isTokenExpired,
      setIsTokenExpired,
      logout: auth.handlers.logout,
    });
  }, []);

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
        auth.userInfos?.type !== TypeUser.FUEL
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

  return (
    <AuthProvider>
      <TransactionsProvider>
        <WorkspaceProvider>
          <AppRoutes />
        </WorkspaceProvider>
      </TransactionsProvider>
    </AuthProvider>
  );
}

export default App;
