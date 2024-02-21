import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '@/modules/auth/hooks';
import { Pages } from '@/modules/core';
//import { useWorkspace } from '@/modules/workspace/hooks';

export interface AuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute = (props: AuthRouteProps) => {
  const auth = useAuth();
  const { search, pathname } = useLocation();
  // const { workspaceId } = useParams();
  // const { handleWorkspaceSelection } = useWorkspace();

  if (!auth.account) {
    return (
      <Navigate
        to={`${Pages.index()}${search}`}
        state={{ from: `${pathname}${search}` }}
      />
    );
  }

  // if (!workspaceId) {
  //   handleWorkspaceSelection(singleWorkspace);
  // }

  return props.children;
};

export { AuthRoute };
