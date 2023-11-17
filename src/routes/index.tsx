import { BrowserRouter, Routes } from 'react-router-dom';

import {
  addressBookRoutes,
  exampleRoutes,
  faucetRoutes,
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
    {faucetRoutes}
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
