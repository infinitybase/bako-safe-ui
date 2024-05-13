import { Route } from 'react-router-dom';

import { DashboardLayoutRouter } from '@/layouts';
import { AuthRoute, Pages } from '@/modules/core';

import { CreateMemberPage } from './pages';
import { WorkspacePage } from './pages/home';

const workspaceRoutes = (
  <Route element={<DashboardLayoutRouter />}>
    <Route
      path={Pages.workspace()}
      element={
        <AuthRoute>
          <WorkspacePage />
        </AuthRoute>
      }
    >
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
    </Route>
  </Route>
);

export { workspaceRoutes };
