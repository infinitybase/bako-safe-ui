import { Button, Text, VStack } from 'bako-ui';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useWalletSignIn } from '@/modules/auth';
import { SigninContainerMobile } from '@/modules/auth/components';
import { EConnectors } from '@/modules/core/hooks/fuel/useListConnectors';
import { Pages } from '@/modules/core/routes';

const DappEVMSignInPage = () => {
  const navigate = useNavigate();
  const { handleSelectWallet, isAnyWalletConnectorOpen } = useWalletSignIn(() =>
    navigate(`${Pages.dappAuth()}${location.search}`),
  );

  useEffect(() => {
    handleSelectWallet(EConnectors.EVM);
  }, []);

  return (
    <SigninContainerMobile>
      <VStack flex={1} justifyContent="center" alignItems="center">
        <Text>Sign in with your Ethereum wallet</Text>
        <Button
          disabled={isAnyWalletConnectorOpen}
          onClick={() => handleSelectWallet(EConnectors.EVM)}
        >
          Connect
        </Button>
      </VStack>
    </SigninContainerMobile>
  );
};

export { DappEVMSignInPage };
