import { Route } from 'react-router-dom';

import { DashboardLayoutRouter } from '@/layouts/dashboard';
import { DefaultLayoutRouter } from '@/layouts/default';
import { AuthRoute } from '@/modules/core/components/route/auth';

import { Pages } from '../core/routes';
import { TransactionsVaultPage } from './pages/list';
import { MeTransactionsPage } from './pages/me';

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
    <Route Component={() => <DashboardLayoutRouter hasSideBar />}>
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
