import { Route, Routes } from 'react-router-dom';

import { DashboardLayoutRouter } from '@/layouts';
import { AuthRoute, Pages } from '@/modules/core';
import { CreateTemplatePage } from '@/modules/template/hooks/useTemplatePage';
import { CreateTransactionPage } from '@/modules/transactions/pages';
import { VaultBalancePage, VaultDetailsPage, VaultSettingsPage } from './pages';
import { VaultInfosProvider } from './providers/VaultInfosProvider';

const VaultRoutes = () => (
  <VaultInfosProvider>
    <Routes>
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
        <Route
          path={Pages.vaultBalance()}
          element={
            <AuthRoute>
              <VaultBalancePage />
            </AuthRoute>
          }
        />
      </Route>
    </Routes>
  </VaultInfosProvider>
);

export { VaultRoutes };
