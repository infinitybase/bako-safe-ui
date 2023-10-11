import React from 'react';
import { Navigate } from 'react-router-dom';

import { CookieName, CookiesConfig } from '@/config/cookies';
import { Pages } from '@/modules';

export interface AuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute = (props: AuthRouteProps) => {
  const { ADDRESS } = CookieName;

  if (!CookiesConfig.getCookie(ADDRESS)) {
    return <Navigate to={Pages.index()} />;
  }

  return props.children;
};

export { AuthRoute };
