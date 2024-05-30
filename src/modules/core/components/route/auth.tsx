import React, { useEffect } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';

import { useAuth } from '@/modules/auth/hooks';
import { Pages } from '@/modules/core';
import { useWorkspace } from '@/modules/workspace/hooks/useWorkspace';

export interface AuthRouteProps {
  children: JSX.Element;
}

const AuthRoute = (props: AuthRouteProps): JSX.Element | null => {
  const auth = useAuth();
  const { search, pathname } = useLocation();
  const { workspaceId } = useParams();
  const { handleWorkspaceSelection } = useWorkspace();

  useEffect(() => {
    handleWorkspaceSelection.handler(workspaceId ?? auth.workspaces.single);
  }, [workspaceId]);

  if (!auth.account) {
    return (
      <Navigate
        to={`${Pages.index()}${search}`}
        state={{ from: `${pathname}${search}` }}
      />
    );
  }

  if (handleWorkspaceSelection.isSelecting) {
    return null;
  }

  return props.children;
};

export { AuthRoute };
