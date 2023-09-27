import { Route } from 'react-router-dom';

import { DashboardLayoutRouter } from '@/layouts';
import { Pages } from '@/modules/core';

import { ExampleHomePage, ExamplePage } from './pages';

const exampleRoutes = (
  <Route path={Pages.example()} element={<DashboardLayoutRouter />}>
    <Route index element={<ExamplePage />} />
    <Route path={Pages.exampleHome()} element={<ExampleHomePage />} />
  </Route>
);

export { exampleRoutes };
