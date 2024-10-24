import { Routes } from 'react-router-dom';

import { addressBookRoutes } from '@/modules/addressBook';
import { signinRoutes } from '@/modules/auth';
import { ScrollTop } from '@/modules/core';
// import { dappRoutes } from '@/modules/dapp';
import { homeRoutes } from '@/modules/home';
import { VaultRoutes } from '@/modules/vault';
import { workspaceRoutes } from '@/modules/workspace';

const routes = (
  <>
    {signinRoutes}
    {workspaceRoutes}
    {homeRoutes}
    {/* {dappRoutes} */}
    {addressBookRoutes}
  </>
);

const AppRoutes = () => {
  return (
    <>
      <ScrollTop />
      <VaultRoutes />
      <Routes>{routes}</Routes>
    </>
  );
};

export { AppRoutes };
