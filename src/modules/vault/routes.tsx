import { Route, Routes } from 'react-router-dom';

import { AuthRoute, Pages } from '@/modules/core';
import { CreateTemplatePage } from '@/modules/template/hooks/useTemplatePage';
import { CreateTransactionPage } from '@/modules/transactions/pages';
import {
  VaultBalancePage,
  VaultDetailsPage,
  VaultSettingsPage,
  TransactionsVaultPage,
} from './pages';
import { VaultInfosProvider } from './providers/VaultInfosProvider';
import { VaultDashboardLayoutRouter } from './layout/VaultDashBoard';

const VaultRoutes = () => {
  return (
    <VaultInfosProvider>
      <Routes>
        <Route element={<VaultDashboardLayoutRouter />}>
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
            path={Pages.transactions()}
            element={
              <AuthRoute>
                <TransactionsVaultPage />
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
};

export { VaultRoutes };
