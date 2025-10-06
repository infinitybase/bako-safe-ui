import { Route, Routes } from 'react-router-dom';

import { AuthRoute } from '@/modules/core/components/route/auth';
import { Pages } from '@/modules/core/routes';
import { CreateTemplatePage } from '@/modules/template/hooks/useTemplatePage';
import { CreateTransactionPage } from '@/modules/transactions/pages';

import { VaultDashboardLayoutRouter } from './layout/VaultDashBoard';
import {
  TransactionsVaultPage,
  VaultBalancePage,
  VaultBridgePage,
  VaultBuySellPage,
  VaultDetailsPage,
  VaultSettingsPage,
} from './pages';
import { VaultBuySellSessionPage } from './pages/buy-sell/session';
import { VaultSwapPage } from './pages/swap';
import { VaultInfosProvider } from './VaultInfosProvider';

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
          <Route
            path={Pages.bridge()}
            element={
              <AuthRoute>
                <VaultBridgePage />
              </AuthRoute>
            }
          />
          <Route
            path={Pages.vaultSwap()}
            element={
              <AuthRoute>
                <VaultSwapPage />
              </AuthRoute>
            }
          />
          <Route
            path={Pages.vaultBuySell()}
            element={
              <AuthRoute>
                <VaultBuySellPage />
              </AuthRoute>
            }
          />
          <Route
            path={Pages.vaultBuySellSession()}
            element={
              <AuthRoute>
                <VaultBuySellSessionPage />
              </AuthRoute>
            }
          />
        </Route>
      </Routes>
    </VaultInfosProvider>
  );
};

export { VaultRoutes };
