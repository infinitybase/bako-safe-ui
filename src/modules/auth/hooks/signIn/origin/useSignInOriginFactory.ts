import { SignInFactory, SignInOrigin } from './types';
import { useDappSignIn } from './useDappSignIn';
import { useWebSignIn } from './useWebSignIn';

const useSignInOriginFactory = (type: SignInOrigin): SignInFactory => {
  const dappSignIn = useDappSignIn();
  const webSignIn = useWebSignIn();

  switch (type) {
    case SignInOrigin.DAPP:
      return dappSignIn;
    case SignInOrigin.WEB:
    default:
      return webSignIn;
  }
};

export { useSignInOriginFactory };
