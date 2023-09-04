import { Route } from 'react-router-dom';

import { DefaultLayoutRouter } from '@/layouts';
import { Pages } from '@/modules/core';

import { ExamplePage } from './pages';

const exampleRoutes = (
  <Route path={Pages.example()} element={<DefaultLayoutRouter />}>
    <Route index element={<ExamplePage />} />
  </Route>
);

export { exampleRoutes };
