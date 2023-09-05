import { Route } from 'react-router-dom';

import { DefaultLayoutRouter } from '@/layouts';
import { AuthRoute, Pages } from '@/modules/core';

import { CreateVaultPage, VaultDetailsPage } from './pages';

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
