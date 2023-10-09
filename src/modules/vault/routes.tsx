import { Route } from 'react-router-dom';

import { DashboardLayoutRouter } from '@/layouts';
import { AuthRoute, Pages } from '@/modules/core';

import { VaultDetailsPage } from './pages';

const vaultRoutes = (
  <Route element={<DashboardLayoutRouter hasSideBar />}>
    <Route
      path={Pages.detailsVault()}
      element={
        <AuthRoute>
          <VaultDetailsPage />
        </AuthRoute>
      }
    />
  </Route>
);

export { vaultRoutes };
