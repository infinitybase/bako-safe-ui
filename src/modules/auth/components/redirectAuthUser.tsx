import { useRedirectAuthUser } from '..';

interface AuthSyncProps {
  children: JSX.Element;
}

const RedirectAuthUser = ({ children }: AuthSyncProps) => {
  const { syncingAuth } = useRedirectAuthUser();

  if (syncingAuth) {
    return null;
  }

  return children;
};

export { RedirectAuthUser };
