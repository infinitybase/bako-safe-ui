import React from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';

import { Pages, useFuelAccount, useWorkspace } from '@/modules';

export interface AuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute = (props: AuthRouteProps) => {
  const { account } = useFuelAccount();
  const { search, pathname } = useLocation();
  const { workspaceId } = useParams();
  const { handleWorkspaceSelection, singleWorkspace } = useWorkspace();

  if (!account) {
    return (
      <Navigate
        to={`${Pages.index()}${search}`}
        state={{ from: `${pathname}${search}` }}
      />
    );
  }

  if (!workspaceId) {
    handleWorkspaceSelection(singleWorkspace);
  }

  return props.children;
};

export { AuthRoute };
