import { useFuel } from '@fuels/react';
import { TypeUser } from 'bakosafe';
import { useEffect } from 'react';

import { AppRoutes } from '@/routes';

import { invalidateQueries } from './modules/core/utils';
import { useWorkspaceContext } from './modules/workspace/WorkspaceProvider';
import { CookieName, CookiesConfig } from './config/cookies';

function App() {
  const { fuel } = useFuel();
  const { authDetails: auth } = useWorkspaceContext();

  useEffect(() => {
    // async function clearAll() {
    //   console.log('clearing all');
    //   // auth.handlers.logout?.();
    //   invalidateQueries();
    // }

    function onConnection(isConnected: boolean) {
      if (isConnected) return;
      // clearAll();
    }

    function onCurrentAccount(currentAccount: string) {
      // console.log('onCurrentAccount', currentAccount);
      // console.log(
      //   'COOKIE ADDRESS',
      //   CookiesConfig.getCookie(CookieName.ADDRESS),
      // );
      // console.log('USER INFOS ADDRESS', auth.userInfos.address);
      if (
        currentAccount === auth.userInfos?.address ||
        auth.userInfos?.type !== TypeUser.FUEL
      )
        return;
      // clearAll();
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
