import { Route } from 'react-router-dom';

import { AuthRoute, Pages } from '@/modules/core';

import { TemplatePage } from './pages';

const templateRoutes = (
  <Route
    path={Pages.template()}
    element={
      <AuthRoute>
        <TemplatePage />
      </AuthRoute>
    }
  />
);

export { templateRoutes };
