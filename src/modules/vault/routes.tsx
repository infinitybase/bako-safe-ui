import { Route } from 'react-router-dom';

import { DashboardLayoutRouter } from '@/layouts';
import { AuthRoute, Pages } from '@/modules/core';

import { VaultDetailsPage } from './pages';
import { UserVaultsPage } from './pages/user-vaults';

const vaultRoutes = (
  <Route element={<DashboardLayoutRouter />}>
    <Route
      path={Pages.detailsVault()}
      element={
        <AuthRoute>
          <VaultDetailsPage />
        </AuthRoute>
      }
    />
    {/* <Route
      path={Pages.createTransaction()}
      element={
        <AuthRoute>
          <CreateTransactionPage />
        </AuthRoute>
      }
    /> */}
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

export { vaultRoutes };
