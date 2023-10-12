import { Route } from 'react-router-dom';

import { Pages } from '@/modules/core';

import { FaucetPage } from './pages';

const faucetRoutes = (
  <Route path={Pages.faucet()}>
    <Route index element={<FaucetPage />} />
  </Route>
);

export { faucetRoutes };
