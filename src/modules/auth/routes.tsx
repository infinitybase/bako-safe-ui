import { Route } from 'react-router-dom';

import { Pages } from '@/modules/core/routes';

import { RedirectAuthUser } from './components/redirectAuthUser';
import { SigninPage } from './pages';

const signinRoutes = (
  <Route path={Pages.index()}>
    <Route
      index
      element={
        <RedirectAuthUser>
          <SigninPage />
        </RedirectAuthUser>
      }
    />
  </Route>
);

export { signinRoutes };
