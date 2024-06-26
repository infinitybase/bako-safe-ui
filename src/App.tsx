import { useFuel } from '@fuels/react';
import { TypeUser } from 'bakosafe';
import { useEffect } from 'react';

import { useAuth } from '@/modules/auth/hooks';
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
      if (currentAccount === auth.account || auth.accountType !== TypeUser.FUEL)
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

  return <AppRoutes />;
}

export default App;
