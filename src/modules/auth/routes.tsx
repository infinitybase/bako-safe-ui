import { Route } from 'react-router-dom';

import { Pages } from '@/modules/core/routes';

import { SigninPage } from './pages';

const signinRoutes = (
  <Route path={Pages.index()}>
    <Route index element={<SigninPage />} />
  </Route>
);

export { signinRoutes };
