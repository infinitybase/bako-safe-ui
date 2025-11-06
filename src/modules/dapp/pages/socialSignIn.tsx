import { useEffect } from 'react';

import { useSocialSignIn } from '@/modules/auth/hooks/signIn/useSocialSignIn';

import { DappSignInContainer } from '../components/signIn';

const DappSocialSignInPage = () => {
  const { isModalOpen, connect } = useSocialSignIn();

  useEffect(() => {
    connect();
  }, []);

  return (
    <DappSignInContainer
      message="Sign in with your Email or Google Account"
      disableConnect={isModalOpen}
      onConnect={connect}
    />
  );
};

export { DappSocialSignInPage };
