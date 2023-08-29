import { Route } from 'react-router-dom';

import { ExamplePage } from './pages';

const exampleRoutes = (
  <Route path="/">
    <Route index element={<ExamplePage />} />
  </Route>
);

export { exampleRoutes };
