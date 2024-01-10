import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { Pages, useFuelAccount } from '@/modules';

export interface AuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute = (props: AuthRouteProps) => {
  const { account } = useFuelAccount();
  const { search, pathname } = useLocation();

  if (!account) {
    return (
      <Navigate
        to={`${Pages.index()}${search}`}
        state={{ from: `${pathname}${search}` }}
      />
    );
  }

  return props.children;
};

export { AuthRoute };
