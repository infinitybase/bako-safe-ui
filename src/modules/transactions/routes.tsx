import { Route } from 'react-router-dom';

import { DefaultLayoutRouter } from '@/layouts/default';
import { AuthRoute } from '@/modules/core/components/route/auth';

import { Pages } from '../core/routes';
import { MeTransactionsPage } from './pages/me';

const transactionRoutes = (
  <Route>
    <Route element={<DefaultLayoutRouter />}>
      <Route
        path={Pages.signatures()}
        element={
          <AuthRoute>
            <MeTransactionsPage />
          </AuthRoute>
        }
      />
    </Route>
  </Route>
);

export { transactionRoutes };
