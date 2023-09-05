import { Route } from 'react-router-dom';

import { DefaultLayoutRouter } from '@/layouts';
import { AuthRoute, Pages } from '@/modules/core';
import { TransactionsVaultPage } from '@/modules/transactions/pages/list';

const transactionRoutes = (
  <Route element={<DefaultLayoutRouter />}>
    <Route
      path={Pages.transactions()}
      element={
        <AuthRoute>
          <TransactionsVaultPage />
        </AuthRoute>
      }
    />
  </Route>
);

export { transactionRoutes };
