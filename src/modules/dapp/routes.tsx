import { Route } from 'react-router-dom';

import { AuthRoute } from '@/modules/core/components/route/auth';
import { Pages } from '@/modules/core/routes';

import { DappWelcomeDialog, TransactionConfirm, VaultConnector } from './pages';
import { SignMessage } from './pages/signMessage';

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

    <Route path={Pages.dappSign()}>
      <Route
        index
        element={
          <AuthRoute>
            <SignMessage />
          </AuthRoute>
        }
      />
    </Route>

    <Route path={Pages.dappWelcome()}>
      <Route
        index
        element={
          <AuthRoute>
            <DappWelcomeDialog />
          </AuthRoute>
        }
      />
    </Route>

    <Route path={Pages.dappTransaction()} element={<TransactionConfirm />} />
  </>
);

export { dappRoutes };
