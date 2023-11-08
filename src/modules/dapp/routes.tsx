import { Route } from 'react-router-dom';

import { Pages } from '@/modules/core';

import { TransactionConfirm, VaultSelect } from './pages';

const dappRoutes = (
  <>
    <Route path={Pages.dappAuth()}>
      <Route index element={<VaultSelect />} />
    </Route>

    <Route path={Pages.dappTransaction()} element={<TransactionConfirm />} />
  </>
);

export { dappRoutes };
