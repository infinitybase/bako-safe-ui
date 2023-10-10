import React from 'react';
import { Navigate } from 'react-router-dom';

import { useFuelAccount } from '@/modules/auth';
import { Pages } from '@/modules/core/routes';

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
