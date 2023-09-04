import { Route } from 'react-router-dom';

import { DefaultLayoutRouter } from '@/layouts';
import { AuthRoute, Pages } from '@/modules/core';

import { CreateVaultPage } from './pages/create';

const vaultRoutes = (
  <Route element={<DefaultLayoutRouter />}>
    <Route
      path={Pages.createVault()}
      element={
        <AuthRoute>
          <CreateVaultPage />
        </AuthRoute>
      }
    />
  </Route>
);

export { vaultRoutes };
