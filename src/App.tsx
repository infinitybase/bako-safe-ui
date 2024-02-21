import { useFuel } from '@fuels/react';
import { useEffect } from 'react';

import { CookieName, CookiesConfig } from '@/config/cookies';
import { AppRoutes } from '@/routes';

import { useFuelAccount } from './modules/auth/store';
import { invalidateQueries } from './modules/core/utils';
import { useTransactionSend } from './modules/transactions';

function App() {
  const { fuel } = useFuel();
  const { setAccount, account } = useFuelAccount();
  const transactionSend = useTransactionSend();

  useEffect(() => {
    function clearAll() {
      setAccount('');
      CookiesConfig.removeCookies([
        CookieName.ACCESS_TOKEN,
        CookieName.ADDRESS,
      ]);
      invalidateQueries();
      transactionSend.clearAll();
    }

    function onConnection(isConnected: boolean) {
      if (isConnected) return;
      clearAll();
    }

    function onCurrentAccount(currentAccount: string) {
      if (currentAccount === account) return;
      clearAll();
    }

    fuel?.on(fuel?.events.connection, onConnection);
    fuel?.on(fuel?.events.currentAccount, onCurrentAccount);

    return () => {
      fuel?.off(fuel?.events.connection, onConnection);
      fuel?.off(fuel?.events.currentAccount, onCurrentAccount);
    };
  }, [fuel, setAccount]);

  return <AppRoutes />;
}

export default App;
