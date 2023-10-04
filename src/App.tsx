import { useEffect } from 'react';

import { useFuel, useFuelAccount } from '@/modules';
import { AppRoutes } from '@/routes';

function App() {
  const [fuel] = useFuel();
  const { setAccount } = useFuelAccount();

  useEffect(() => {
    function onFuelEvent() {
      setAccount('');
    }

    fuel?.on(fuel?.events.connection, onFuelEvent);
    fuel?.on(fuel?.events.currentAccount, onFuelEvent);

    return () => {
      fuel?.on(fuel?.events.connection, onFuelEvent);
      fuel?.on(fuel?.events.currentAccount, onFuelEvent);
    };
  }, [fuel, setAccount]);

  return <AppRoutes />;
}

export default App;
