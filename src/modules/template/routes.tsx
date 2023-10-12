import { Route } from 'react-router-dom';

import { AuthRoute, Pages } from '@/modules/core';

import { TemplatePage } from './pages';

const templateRoutes = (
  <Route
    path={Pages.createTemplate()}
    element={
      <AuthRoute>
        <TemplatePage />
      </AuthRoute>
    }
  />
);

export { templateRoutes };
