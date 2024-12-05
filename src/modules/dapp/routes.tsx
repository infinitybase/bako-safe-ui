import { Route } from 'react-router-dom';

import { AuthRoute } from '@/modules/core/components/route/auth';
import { Pages } from '@/modules/core/routes';

import { TransactionConfirm, VaultConnector } from './pages';

const dappRoutes = (
  <>
    <Route path={Pages.dappAuth()}>
      <Route
        index
        element={
          <AuthRoute>
            <VaultConnector />
          </AuthRoute>
        }
      />
    </Route>

    <Route path={Pages.dappTransaction()} element={<TransactionConfirm />} />
  </>
);

export { dappRoutes };
