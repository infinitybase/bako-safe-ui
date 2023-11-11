import { BrowserRouter, Routes } from 'react-router-dom';

import {
  dappRoutes,
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
