import { Route } from 'react-router-dom';

import { DAPPLayout } from '@/layouts';
import { AuthRoute, Pages } from '@/modules/core';

import { TransactionConfirm } from './pages';
import { VaultConnector } from './pages/VaultConnector';

const dappRoutes = (
  <>
    <Route path={Pages.dappAuth()}>
      <Route
        index
        element={
          <DAPPLayout.Container>
            <VaultConnector />
          </DAPPLayout.Container>
        }
      />
    </Route>

    <Route
      path={Pages.dappTransaction()}
      element={
        <DAPPLayout.Container>
          <AuthRoute>
            <TransactionConfirm />
          </AuthRoute>
        </DAPPLayout.Container>
      }
    />
  </>
);

export { dappRoutes };
