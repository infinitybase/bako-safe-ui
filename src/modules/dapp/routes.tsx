import { Route } from 'react-router-dom';

import { Container } from '@/layouts/dapp/container';
import { AuthRoute } from '@/modules/core/components/route/auth';
import { Pages } from '@/modules/core/routes';

import { TransactionConfirm, TransactionSign, VaultConnector } from './pages';

const dappRoutes = (
  <>
    <Route path={Pages.dappAuth()}>
      <Route
        index
        element={
          <AuthRoute>
            <Container>
              <VaultConnector />
            </Container>
          </AuthRoute>
        }
      />
    </Route>

    <Route
      path={Pages.dappTransaction()}
      element={
        <Container>
          <TransactionConfirm />
        </Container>
      }
    />

    <Route
      path={Pages.dappTransactionSign()}
      element={
        <Container>
          <TransactionSign />
        </Container>
      }
    />
  </>
);

export { dappRoutes };
