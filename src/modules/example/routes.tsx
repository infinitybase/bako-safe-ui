import { Route } from 'react-router-dom';

import { DashboardLayoutRouter } from '@/layouts';
import { Pages } from '@/modules/core';

import { ExampleHomePage, ExamplePage } from './pages';

const exampleRoutes = (
  <Route path={Pages.example()} element={<DashboardLayoutRouter />}>
    <Route index element={<ExampleHomePage />} />
    <Route path={Pages.exampleHome()} element={<ExamplePage />} />
  </Route>
);

export { exampleRoutes };
