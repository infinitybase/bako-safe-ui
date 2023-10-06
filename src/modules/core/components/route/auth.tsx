import React from 'react';

export interface AuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute = (props: AuthRouteProps) => {
  //const { account } = useFuelAccount();

  // if (!account) {
  //   return <Navigate to={Pages.index()} />;
  // }

  return props.children;
};

export { AuthRoute };
