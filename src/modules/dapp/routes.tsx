import { Route } from 'react-router-dom';

import { Container } from '@/layouts/dapp/container';
import { AuthRoute, Pages } from '@/modules/core';

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
