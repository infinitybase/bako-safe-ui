import { Route } from 'react-router-dom';

import { DashboardLayoutRouter } from '@/layouts';
import { AuthRoute, Pages } from '@/modules/core';

import { CreateWorkspacePage } from './pages';
import { WorkspacePage } from './pages/home';

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
