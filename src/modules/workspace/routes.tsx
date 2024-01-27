import React from 'react';
import { Route } from 'react-router-dom';

import { Pages } from '@/modules/core';

import { CreateMemberPage, CreateWorkspacePage } from './pages';
import { WorkspacePage } from './pages/home';

const AuthRoute = React.lazy(async () => {
  const newVar = await import('@/modules/core');
  return { default: newVar.AuthRoute };
});

const DashboardLayoutRouter = React.lazy(async () => {
  const newVar = await import('@/layouts');
  return { default: newVar.DashboardLayoutRouter };
});

const workspaceRoutes = (
  <Route>
    <Route
      path={Pages.createWorkspace()}
      element={
        <AuthRoute>
          <CreateWorkspacePage />
        </AuthRoute>
      }
    />
    <Route
      path={Pages.membersWorkspace()}
      element={
        <AuthRoute>
          <CreateMemberPage />
        </AuthRoute>
      }
    />
    <Route
      path={Pages.updateMemberWorkspace()}
      element={
        <AuthRoute>
          <CreateMemberPage />
        </AuthRoute>
      }
    />
    <Route element={<DashboardLayoutRouter />}>
      <Route
        path={Pages.workspace()}
        element={
          <AuthRoute>
            <WorkspacePage />
          </AuthRoute>
        }
      />
    </Route>
  </Route>
);

export { workspaceRoutes };
