import { Route } from 'react-router-dom';

import { Pages } from '@/modules/core/routes';

import { RedirectAuthUser } from './components/redirectAuthUser';
import { RedirectFromLandingPage } from './components/redirectFromLandingPage';
import { SigninPage } from './pages';

const signinRoutes = (
  <Route path={Pages.index()}>
    <Route
      index
      element={
        <RedirectFromLandingPage>
          <RedirectAuthUser>
            <SigninPage />
          </RedirectAuthUser>
        </RedirectFromLandingPage>
      }
    />
  </Route>
);

export { signinRoutes };
