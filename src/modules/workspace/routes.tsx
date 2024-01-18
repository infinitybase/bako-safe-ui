import { Route } from 'react-router-dom';

import { Pages } from '@/modules/core';
import { ExamplePage } from '@/modules/example';

const workspaceRoutes = (
  <Route>
    <Route path={Pages.createWorkspace()} element={<ExamplePage />} />
  </Route>
);

export { workspaceRoutes };
