import { Route } from 'react-router-dom';

import { Pages } from '@/modules/core';

import { ExamplePage } from './pages';

const exampleRoutes = (
  <Route path={Pages.example()}>
    <Route index element={<ExamplePage />} />
  </Route>
);

export { exampleRoutes };
