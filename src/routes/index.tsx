import { BrowserRouter, Routes } from 'react-router-dom';

import { addressBookRoutes } from '@/modules/addressBook';
import { signinRoutes } from '@/modules/auth';
import { ScrollTop } from '@/modules/core';
import { dappRoutes } from '@/modules/dapp';
import { homeRoutes } from '@/modules/home';
import { transactionRoutes } from '@/modules/transactions';
import { VaultRoutes } from '@/modules/vault';
import { workspaceRoutes } from '@/modules/workspace';

const routes = (
  <>
    {signinRoutes}
    {homeRoutes}
    {dappRoutes}
    {transactionRoutes}
    {addressBookRoutes}
    {workspaceRoutes}
  </>
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ScrollTop />
      <VaultRoutes />
      <Routes>{routes}</Routes>
    </BrowserRouter>
  );
};

export { AppRoutes };
