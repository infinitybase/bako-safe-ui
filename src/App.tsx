import { useEffect } from 'react';

import { CookieName, CookiesConfig } from '@/config/cookies';
import { invalidateQueries, useFuel, useFuelAccount } from '@/modules';
import { AppRoutes } from '@/routes';

function App() {
  const [fuel] = useFuel();
  const { setAccount } = useFuelAccount();

  useEffect(() => {
    function onFuelEvent() {
      setAccount('');
      CookiesConfig.removeCookies([
        CookieName.ACCESS_TOKEN,
        CookieName.ADDRESS,
      ]);
      invalidateQueries();
    }

    fuel?.on(fuel?.events.connection, onFuelEvent);
    fuel?.on(fuel?.events.currentAccount, onFuelEvent);

    return () => {
      fuel?.off(fuel?.events.connection, onFuelEvent);
      fuel?.off(fuel?.events.currentAccount, onFuelEvent);
    };
  }, [fuel, setAccount]);

  return <AppRoutes />;
}

export default App;
