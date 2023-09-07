import { Route } from 'react-router-dom';

import { DefaultLayoutRouter } from '@/layouts';
import { AuthRoute, Pages } from '@/modules/core';

import {
  CreateTransactionPage,
  DetailsTransactionPage,
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
      path={Pages.createTransaction()}
      element={
        <AuthRoute>
          <CreateTransactionPage />
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
  </Route>
);

export { transactionRoutes };
