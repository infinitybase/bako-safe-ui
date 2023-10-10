import React from 'react';
import { Navigate } from 'react-router-dom';

import { Pages } from '@/modules';
import { useFuelAccount } from '@/modules/auth';

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
