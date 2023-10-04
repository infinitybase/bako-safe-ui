import { Routes } from 'react-router-dom';

import {
  exampleRoutes,
  homeRoutes,
  signinRoutes,
  transactionRoutes,
  vaultRoutes,
} from '@/modules';

const routes = (
  <>
    {exampleRoutes}
    {signinRoutes}
    {homeRoutes}
    {vaultRoutes}
    {transactionRoutes}
  </>
);

const AppRoutes = () => {
  return <Routes>{routes}</Routes>;
};

export { AppRoutes };
