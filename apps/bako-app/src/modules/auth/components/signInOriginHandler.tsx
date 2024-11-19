// import { DappSignInPage } from '@/dapp/pages/signIn';

// todo: dapp verify and remove
import { useQueryParams, WebSignInPage } from '..';

const SignInOriginHandler = () => {
  const { sessionId: isFromDapp } = useQueryParams();

  if (isFromDapp) {
    // return <DappSignInPage />;
  }

  return <WebSignInPage />;
};

export { SignInOriginHandler };
