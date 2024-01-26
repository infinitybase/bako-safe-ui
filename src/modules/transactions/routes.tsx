import { Route } from 'react-router-dom';

import { DashboardLayoutRouter } from '@/layouts/dashboard';
import { DefaultLayoutRouter } from '@/layouts/default';

import { AuthRoute } from '../core/components';
import { Pages } from '../core/routes';
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
