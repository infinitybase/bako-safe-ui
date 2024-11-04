import { AuthRoute, Pages } from '@app/modules/core';
import { Route } from 'react-router-dom';

import { TransactionConfirm, VaultConnector } from './pages';
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

    <Route path={Pages.dappTransaction()} element={<TransactionConfirm />} />

    {/* [CONNECTOR SIGNATURE]
    <Route path={Pages.dappTransactionSign()} element={<TransactionSign />} /> 
    */}
  </>
);

export { dappRoutes };