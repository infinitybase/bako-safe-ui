import { Route } from 'react-router-dom';

import { DashboardLayoutRouter } from '@/layouts/dashboard';
import { DefaultLayoutRouter } from '@/layouts/default';

import { AuthRoute, Pages } from '../core';
import { MeTransactionsPage, TransactionsVaultPage } from './pages';

const transactionRoutes = (
  <Route>
    <Route element={<DefaultLayoutRouter />}>
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
