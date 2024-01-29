import React from 'react';
import { Route } from 'react-router-dom';

import { Pages } from '../core';
import { CreateTemplatePage } from '../template/hooks/useTemplatePage';
// import { CreateTransactionPage } from '../transactions';
import { VaultDetailsPage, VaultSettingsPage } from './pages';

const AuthRoute = React.lazy(async () => {
  const newVar = await import('@/modules/core');
  return { default: newVar.AuthRoute };
});

const DashboardLayoutRouter = React.lazy(async () => {
  const newVar = await import('@/layouts');
  return { default: newVar.DashboardLayoutRouter };
});

const CreateTransactionPage = React.lazy(async () => {
  const newVar = await import('../transactions');
  return { default: newVar.CreateTransactionPage };
});

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
