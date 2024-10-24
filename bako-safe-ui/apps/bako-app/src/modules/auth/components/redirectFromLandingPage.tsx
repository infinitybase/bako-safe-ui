import { useRedirectFromLandingPage } from '..';

interface RedirectFromLandingPageProps {
  children: JSX.Element;
}

const RedirectFromLandingPage = ({
  children,
}: RedirectFromLandingPageProps) => {
  const { checkingOrigin } = useRedirectFromLandingPage();

  if (checkingOrigin) {
    return null;
  }

  return children;
};

export { RedirectFromLandingPage };
