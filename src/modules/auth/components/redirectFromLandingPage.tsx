import { useRedirectFromLandingPage } from '..';

interface AuthSyncProps {
  children: JSX.Element;
}

const RedirectFromLandingPage = ({ children }: AuthSyncProps) => {
  const { checkingOrigin } = useRedirectFromLandingPage();

  if (checkingOrigin) {
    return null;
  }

  return children;
};

export { RedirectFromLandingPage };
