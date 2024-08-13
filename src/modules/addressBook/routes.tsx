import { Route } from 'react-router-dom';

import { DashboardLayoutRouter } from '@/layouts';
import { Pages } from '@/modules/core/routes';
import { AuthRoute } from '@/modules/core/components/route/auth';

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
