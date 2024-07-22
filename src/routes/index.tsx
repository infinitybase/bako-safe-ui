import { BrowserRouter, Routes } from 'react-router-dom';

import { addressBookRoutes } from '@/modules/addressBook';
import { signinRoutes } from '@/modules/auth';
import { ScrollTop } from '@/modules/core';
import { dappRoutes } from '@/modules/dapp';
// import { exampleRoutes } from '@/modules/example';
import { homeRoutes } from '@/modules/home';
import { transactionRoutes } from '@/modules/transactions';
import { vaultRoutes } from '@/modules/vault';
import { workspaceRoutes } from '@/modules/workspace';
import { VaultInfosProvider } from '@/modules/vault/providers/VaultInfosProvider';
// import { VaultInfosProvider } from '@/modules/vault/providers/VaultInfosProvider';

const routes = (
  <>
    {/* {exampleRoutes} */}
    {signinRoutes}
    {homeRoutes}
    {dappRoutes}
    {vaultRoutes}
    {transactionRoutes}
    {addressBookRoutes}
    {workspaceRoutes}
  </>
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <VaultInfosProvider>
        <ScrollTop />
        <Routes>{routes}</Routes>
      </VaultInfosProvider>
    </BrowserRouter>
  );
};

export { AppRoutes };
