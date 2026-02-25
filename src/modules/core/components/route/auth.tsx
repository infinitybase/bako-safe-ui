import { Navigate, useLocation } from 'react-router-dom';

import { Pages } from '@/modules/core';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

export interface AuthRouteProps {
  children: JSX.Element;
}

const AuthRoute = (props: AuthRouteProps): JSX.Element | null => {
  const {
    authDetails,
    workspaceInfos: {
      infos: { isSelecting },
    },
  } = useWorkspaceContext();
  const { search, pathname } = useLocation();

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
