import { Navigate, Route, Routes } from 'react-router-dom';

import { signinRoutes } from '@/modules/auth';
import { homeRoutes } from '@/modules/home';
import { workspaceRoutes } from '@/modules/workspace';
import { addressBookRoutes } from '@/modules/addressBook';
import { ScrollTop } from '@/modules/core';
import { dappRoutes } from '@/modules/dapp';
import { VaultRoutes } from '@/modules/vault';

const routes = (
  <>
    {signinRoutes}
    {/* {workspaceRoutes}
    {homeRoutes}
    {dappRoutes}
    {addressBookRoutes} */}
  </>
);

const AppRoutes = () => {
  return (
    <>
      <ScrollTop />
      {/* <VaultRoutes /> */}
      <Routes>
        {routes}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export { AppRoutes };
