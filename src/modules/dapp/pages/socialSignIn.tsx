import { Button, Text, VStack } from 'bako-ui';
import { useEffect } from 'react';

import { SigninContainerMobile } from '@/modules/auth/components';
import { useSocialSignIn } from '@/modules/auth/hooks/signIn/useSocialSignIn';

const DappSocialSignInPage = () => {
  const { isModalOpen, connect } = useSocialSignIn();

  useEffect(() => {
    connect();
  }, []);

  return (
    <SigninContainerMobile>
      <VStack flex={1} justifyContent="center" alignItems="center">
        <Text>Sign in with your Email or Google account</Text>
        <Button disabled={isModalOpen} onClick={connect}>
          Connect
        </Button>
      </VStack>
    </SigninContainerMobile>
  );
};

export { DappSocialSignInPage };
