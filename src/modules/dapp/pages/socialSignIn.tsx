import { useSocialSignIn } from '@/modules/auth/hooks';

import { DappSignInContainer } from '../components/signIn';

const DappSocialSignInPage = () => {
  const { ready, authenticated, isModalOpen, isLoggingOut, connect } =
    useSocialSignIn();

  return (
    <DappSignInContainer
      message="Sign in with your Email or Google Account"
      disableConnect={!ready || authenticated || isModalOpen || isLoggingOut}
      onConnect={connect}
    />
  );
};

export { DappSocialSignInPage };
