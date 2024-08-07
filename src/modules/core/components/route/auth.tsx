import { useEffect } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';

import { Pages } from '@/modules/core';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

export interface AuthRouteProps {
  children: JSX.Element;
}

const AuthRoute = (props: AuthRouteProps): JSX.Element | null => {
  const {
    authDetails,
    workspaceInfos: {
      handlers: { handleWorkspaceSelection },
      infos: { isSelecting },
    },
  } = useWorkspaceContext();
  const { search, pathname } = useLocation();
  const { workspaceId } = useParams();

  useEffect(() => {
    handleWorkspaceSelection(
      workspaceId ?? authDetails.userInfos?.workspace?.id,
    );
  }, [workspaceId]);

  if (!authDetails.userInfos?.address) {
    return (
      <Navigate
        to={`${Pages.index()}${search}`}
        state={{ from: `${pathname}${search}` }}
      />
    );
  }

  if (isSelecting) {
    return null;
  }

  return props.children;
};

export { AuthRoute };
