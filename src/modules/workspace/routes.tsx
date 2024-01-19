import { Route } from 'react-router-dom';

import { Pages } from '@/modules/core';

import { CreateWorkspacePage } from './pages';

const workspaceRoutes = (
  <Route>
    <Route path={Pages.createWorkspace()} element={<CreateWorkspacePage />} />
  </Route>
);

export { workspaceRoutes };
