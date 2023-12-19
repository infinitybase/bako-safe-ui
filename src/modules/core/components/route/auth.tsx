import React from 'react';
import { Navigate } from 'react-router-dom';

import { Pages, useFuelAccount } from '@/modules';

export interface AuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute = (props: AuthRouteProps) => {
  const { account } = useFuelAccount();

  if (!account) {
    return <Navigate to={Pages.index()} />;
  }

  return props.children;
};

export { AuthRoute };
