import {
  BrowserRouter,
  Route,
  Routes,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import { addressBookRoutes } from '@/modules/addressBook';
import { signinRoutes } from '@/modules/auth';
import { ScrollTop } from '@/modules/core';
import { dappRoutes } from '@/modules/dapp';
// import { exampleRoutes } from '@/modules/example';
import { homeRoutes } from '@/modules/home';
import { transactionRoutes } from '@/modules/transactions';
import { VaultRoutes } from '@/modules/vault';
import { workspaceRoutes } from '@/modules/workspace';
import { VaultInfosProvider } from '@/modules/vault/providers/VaultInfosProvider';

const routes = (
  <>
    {/* {exampleRoutes} */}
    {signinRoutes}
    {homeRoutes}
    {dappRoutes}
    {/* {vaultRoutes} */}
    {transactionRoutes}
    {addressBookRoutes}
    {workspaceRoutes}
  </>
);

const router = createBrowserRouter(
  createRoutesFromElements(<Route>{routes}</Route>),
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      {/* <VaultInfosProvider> */}
      <ScrollTop />
      <Routes>{routes}</Routes>
      {/* </VaultInfosProvider> */}
      {/* {vaultRoutes} */}
      <VaultRoutes />
    </BrowserRouter>
  );
};

export { AppRoutes };
