import { Route } from 'react-router-dom';

import { Dapp } from '@/layouts';
import { AuthRoute, Pages } from '@/modules/core';

import { TransactionConfirm, VaultSelect } from './pages';

const dappRoutes = (
  <>
    <Route path={Pages.dappAuth()}>
      <Route
        index
        element={
          <Dapp.Container>
            <VaultSelect />
          </Dapp.Container>
        }
      />
    </Route>

    <Route
      path={Pages.dappTransaction()}
      element={
        <Dapp.Container>
          <AuthRoute>
            <TransactionConfirm />
          </AuthRoute>
        </Dapp.Container>
      }
    />
  </>
);

export { dappRoutes };
