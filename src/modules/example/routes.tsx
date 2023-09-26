import { Route } from 'react-router-dom';

import { DashboardLayoutRouter } from '@/layouts';
import { Pages } from '@/modules/core';

import { ExamplePage } from './pages';

const exampleRoutes = (
  <Route path={Pages.example()} element={<DashboardLayoutRouter />}>
    <Route index element={<ExamplePage />} />
  </Route>
);

export { exampleRoutes };
