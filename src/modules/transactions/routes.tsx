import { Route } from 'react-router-dom';

import { DefaultLayoutRouter } from '@/layouts';
import { AuthRoute, Pages } from '@/modules/core';

import {
  DetailsTransactionPage,
  MeTransactionsPage,
  TransactionsVaultPage,
} from './pages';

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
    <Route
      path={Pages.detailsTransaction()}
      element={
        <AuthRoute>
          <DetailsTransactionPage />
        </AuthRoute>
      }
    />
    <Route
      path={Pages.signatures()}
      element={
        <AuthRoute>
          <MeTransactionsPage />
        </AuthRoute>
      }
    />
  </Route>
);

export { transactionRoutes };
