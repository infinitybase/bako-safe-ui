import { Route } from 'react-router-dom';

import { Pages } from '@/modules/core/routes';

import { RedirectFromLandingPage } from './components/redirectFromLandingPage';
import { SigninPage } from './pages';

const signinRoutes = (
  <Route path={Pages.index()}>
    <Route
      index
      element={
        <RedirectFromLandingPage>
          <SigninPage />
        </RedirectFromLandingPage>
      }
    />
  </Route>
);

export { signinRoutes };
