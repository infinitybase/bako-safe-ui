import React from 'react';
import { Route } from 'react-router-dom';

import { DashboardLayoutRouter } from '@/layouts';
// import { DashboardLayoutRouter } from '@/layouts';
import { DefaultLayoutRouter } from '@/layouts/default';
import { AuthRoute } from '@/modules';

// import { AuthRoute } from '../core/components';
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
