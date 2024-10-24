import { DappSignInPage } from '@/modules/dapp/pages/signIn';

import { useQueryParams, WebSignInPage } from '..';

const SignInOriginHandler = () => {
  const { sessionId: isFromDapp } = useQueryParams();

  if (isFromDapp) {
    return <DappSignInPage />;
  }

  return <WebSignInPage />;
};

export { SignInOriginHandler };
