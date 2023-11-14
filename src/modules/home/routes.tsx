import { Route } from 'react-router-dom';

import { DashboardLayoutRouter } from '@/layouts';
import { AuthRoute, Pages } from '@/modules/core';
import { HomePage } from '@/modules/home/pages';
import { CreateVaultPage, UserVaultsPage } from '@/modules/vault/pages';

import { UserTransactionsPage } from '../transactions/pages/user-transactions';

const homeRoutes = (
  <Route element={<DashboardLayoutRouter />}>
    <Route
      path={Pages.home()}
      element={
        <AuthRoute>
          <HomePage />
        </AuthRoute>
      }
    />
    <Route
      path={Pages.createVault()}
      element={
        <AuthRoute>
          <CreateVaultPage />
        </AuthRoute>
      }
    />
    <Route
      path={Pages.userVaults()}
      element={
        <AuthRoute>
          <UserVaultsPage />
        </AuthRoute>
      }
    />
    <Route
      path={Pages.userTransactions()}
      element={
        <AuthRoute>
          <UserTransactionsPage />
        </AuthRoute>
      }
    />
  </Route>
);

export { homeRoutes };
