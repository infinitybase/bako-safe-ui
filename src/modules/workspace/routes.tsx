import { Route } from 'react-router-dom';

import { DashboardLayoutRouter } from '@/layouts';
import { Pages } from '@/modules/core/routes';
import { AuthRoute } from '@/modules/core/components/route/auth';

import { CreateMemberPage, WorkspaceBalancePage } from './pages';
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

    <Route
      path={Pages.balanceWorkspace()}
      element={
        <AuthRoute>
          <WorkspaceBalancePage />
        </AuthRoute>
      }
    />
  </Route>
);

export { workspaceRoutes };
