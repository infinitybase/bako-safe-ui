import { BrowserRouter, Routes } from 'react-router-dom';

import {
  dappRoutes,
  addressBookRoutes,
  exampleRoutes,
  homeRoutes,
  signinRoutes,
  templateRoutes,
  transactionRoutes,
  vaultRoutes,
} from '@/modules';

const routes = (
  <>
    {exampleRoutes}
    {signinRoutes}
    {homeRoutes}
    {dappRoutes}
    {vaultRoutes}
    {templateRoutes}
    {transactionRoutes}
    {addressBookRoutes}
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
