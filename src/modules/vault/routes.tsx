import { Route } from 'react-router-dom';

import { DashboardLayoutRouter } from '@/layouts';
import { AuthRoute, Pages } from '@/modules/core';

import { UserVaults } from './pages';

const vaultRoutes = (
  <Route path={Pages.userVaults()} element={<DashboardLayoutRouter />}>
    <Route
      index
      element={
        <AuthRoute>
          <UserVaults />
        </AuthRoute>
      }
    />
  </Route>
);

export { vaultRoutes };
