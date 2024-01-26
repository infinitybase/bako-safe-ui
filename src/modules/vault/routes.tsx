import { Route } from 'react-router-dom';

import { DashboardLayoutRouter } from '@/layouts';
import { AuthRoute, Pages } from '@/modules/core';

import { CreateTemplatePage } from '../template/hooks/useTemplatePage';
import { CreateTransactionPage } from '../transactions';
import { VaultDetailsPage, VaultSettingsPage } from './pages';

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
    <Route
      path={Pages.createTemplate()}
      element={
        <AuthRoute>
          <CreateTemplatePage />
        </AuthRoute>
      }
    />
    <Route
      path={Pages.createTransaction()}
      element={
        <AuthRoute>
          <CreateTransactionPage />
        </AuthRoute>
      }
    />
    <Route
      path={Pages.vaultSettings()}
      element={
        <AuthRoute>
          <VaultSettingsPage />
        </AuthRoute>
      }
    />
  </Route>
);

export { vaultRoutes };
