import { BrowserRouter, Routes } from 'react-router-dom';

import {
  addressBookRoutes,
  dappRoutes,
  exampleRoutes,
  homeRoutes,
  signinRoutes,
  transactionRoutes,
  vaultRoutes,
  workspaceRoutes,
} from '@/modules';

const routes = (
  <>
    {exampleRoutes}
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
      <Routes>{routes}</Routes>
    </BrowserRouter>
  );
};

export { AppRoutes };
