import { Routes } from 'react-router-dom';

import { signinRoutes } from '@/modules/auth';
import { homeRoutes } from '@/modules/home';
import { workspaceRoutes } from '@/modules/workspace';
import { addressBookRoutes } from '@/modules/addressBook';
import { ScrollTop } from '@/modules/core';
import { dappRoutes } from '@/modules/dapp';
import { VaultRoutes } from '@/modules/vault';
import FloatingCard from '@/components/floatingCard';

const routes = (
  <>
    {signinRoutes}
    {workspaceRoutes}
    {homeRoutes}
    {dappRoutes}
    {addressBookRoutes}
  </>
);

const AppRoutes = () => {
  return (
    <>
      <FloatingCard />
      <ScrollTop />
      <VaultRoutes />
      <Routes>{routes}</Routes>
    </>
  );
};

export { AppRoutes };
