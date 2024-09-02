import { Route } from 'react-router-dom';

import { DashboardLayoutRouter } from '@/layouts';
import { AuthRoute } from '@/modules/core/components/route/auth';
import { Pages } from '@/modules/core/routes';

import { CreateMemberPage, WorkspaceBalancePage } from './pages';

const workspaceRoutes = (
  <Route element={<DashboardLayoutRouter />}>
    <Route
      path={Pages.workspace()}
      // Commented out code to temporarily disable workspaces.

      // element={
      //   <AuthRoute>
      //     <></>
      //     {/* <WorkspacePage /> */}
      //   </AuthRoute>
      // }
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
