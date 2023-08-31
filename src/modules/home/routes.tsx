import { Route } from 'react-router-dom';

import { Pages } from '@/modules/core';

import { HomePage } from './pages';

const homeRoutes = (
  <Route path={Pages.home()}>
    <Route index element={<HomePage />} />
  </Route>
);

export { homeRoutes };
