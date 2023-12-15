import { Route } from 'react-router-dom';

import { DashboardLayoutRouter } from '@/layouts';
import { AuthRoute, Pages } from '@/modules/core';

import { AddressBookPage } from './pages';

const addressBookRoutes = (
  <Route element={<DashboardLayoutRouter />}>
    <Route
      path={Pages.addressBook()}
      element={
        <AuthRoute>
          <AddressBookPage />
        </AuthRoute>
      }
    />
  </Route>
);

export { addressBookRoutes };
