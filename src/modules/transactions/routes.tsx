import { Route } from 'react-router-dom';

import { DashboardLayoutRouter, DefaultLayoutRouter } from '@/layouts';
import { AuthRoute, Pages } from '@/modules/core';

import {
  DetailsTransactionPage,
  MeTransactionsPage,
  TransactionsVaultPage,
} from './pages';

const transactionRoutes = (
  <Route>
    <Route element={<DefaultLayoutRouter />}>
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
    <Route element={<DashboardLayoutRouter hasSideBar />}>
      <Route
        path={Pages.transactions()}
        element={
          <AuthRoute>
            <TransactionsVaultPage />
          </AuthRoute>
        }
      />
    </Route>
  </Route>
);

export { transactionRoutes };
