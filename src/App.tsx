import { useFuel } from '@fuels/react';
import { useEffect } from 'react';

import { useAuth } from '@/modules';
import { AppRoutes } from '@/routes';

import { invalidateQueries } from './modules/core/utils';
import { useTransactionSend } from './modules/transactions';

function App() {
  const { fuel } = useFuel();
  const auth = useAuth();
  const transactionSend = useTransactionSend();

  useEffect(() => {
    async function clearAll() {
      auth.handlers.logout();
      invalidateQueries();
      transactionSend.clearAll();
    }

    function onConnection(isConnected: boolean) {
      if (isConnected) return;
      clearAll();
    }

    function onCurrentAccount(currentAccount: string) {
      console.log('👉 User disconnected', {
        currentAccount,
        authAccount: auth.account,
      });
      if (currentAccount === auth.account) return;
      clearAll();
    }

    fuel.on(fuel.events.connection, onConnection);
    fuel.on(fuel.events.currentAccount, onCurrentAccount);

    return () => {
      fuel.off(fuel.events.connection, onConnection);
      fuel.off(fuel.events.currentAccount, onCurrentAccount);
    };
  }, [fuel, auth.account]);

  return <AppRoutes />;
}

export default App;
