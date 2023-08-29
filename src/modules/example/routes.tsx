import { Route } from 'react-router-dom';

import { Pages } from '@/modules/core';

import { ExamplePage } from './pages';

const exampleRoutes = (
  <Route path={Pages.index()}>
    <Route index element={<ExamplePage />} />
    <Route path={Pages.example()} element={<ExamplePage />} />
  </Route>
);

export { exampleRoutes };
