import { Route } from 'react-router-dom';

import { Pages } from '@/modules/core';

import { DappPage } from './pages';

const dappRoutes = (
  <Route path={Pages.dapp()}>
    <Route index element={<DappPage />} />
  </Route>
);

export { dappRoutes };
