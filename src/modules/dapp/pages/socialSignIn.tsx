import { useEffect } from 'react';

import { useSocialSignIn } from '@/modules/auth/hooks';

import { DappSignInContainer } from '../components/signIn';

const DappSocialSignInPage = () => {
  const { isModalOpen, modalAlreadyOpened, connect } = useSocialSignIn();

  useEffect(() => {
    if (!isModalOpen && !modalAlreadyOpened.current) connect();
  }, [isModalOpen, modalAlreadyOpened.current]);

  return (
    <DappSignInContainer
      message="Sign in with your Email or Google Account"
      disableConnect={isModalOpen}
      onConnect={connect}
    />
  );
};

export { DappSocialSignInPage };
