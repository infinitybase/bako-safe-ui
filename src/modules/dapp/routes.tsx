import { Route } from 'react-router-dom';

import { AuthRoute, Pages } from '@/modules/core';

import { TransactionConfirm, VaultSelect } from './pages';

const dappRoutes = (
  <>
    <Route path={Pages.dappAuth()}>
      <Route index element={<VaultSelect />} />
    </Route>

    <Route
      path={Pages.dappTransaction()}
      element={
        <AuthRoute>
          <TransactionConfirm />
        </AuthRoute>
      }
    />
  </>
);

export { dappRoutes };
