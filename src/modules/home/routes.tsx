import { Route } from 'react-router-dom';

import { DashboardLayoutRouter } from '@/layouts';
import { AuthRoute, Pages } from '@/modules/core';
import { CreateVaultPage } from '@/modules/vault/pages';
import { UserVaultsPage } from '@/modules/vault/pages/user-vaults';

import { HomePage } from './pages';

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
  </Route>
);

export { homeRoutes };
