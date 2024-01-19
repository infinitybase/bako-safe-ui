import { Route } from 'react-router-dom';

import { AuthRoute, Pages } from '@/modules/core';

import { CreateWorkspacePage } from './pages';

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
  </Route>
);

export { workspaceRoutes };
