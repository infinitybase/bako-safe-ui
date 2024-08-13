import { Route } from 'react-router-dom';

import { Container } from '@/layouts/dapp/container';
import { Pages } from '@/modules/core/routes';
import { AuthRoute } from '@/modules/core/components/route/auth';

import { TransactionConfirm, VaultConnector } from './pages';

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
  </>
);

export { dappRoutes };
