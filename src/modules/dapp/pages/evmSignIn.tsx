import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useWalletSignIn } from '@/modules/auth';
import { EConnectors } from '@/modules/core/hooks/fuel/useListConnectors';
import { Pages } from '@/modules/core/routes';

import { DappSignInContainer } from '../components';

const DappEVMSignInPage = () => {
  const navigate = useNavigate();
  const { handleSelectWallet, isAnyWalletConnectorOpen } = useWalletSignIn(() =>
    navigate(`${Pages.dappAuth()}${location.search}`),
  );

  useEffect(() => {
    handleSelectWallet(EConnectors.EVM);
  }, []);

  return (
    <DappSignInContainer
      message="Sign in with your Ethereum Wallet"
      disableConnect={isAnyWalletConnectorOpen}
      onConnect={() => handleSelectWallet(EConnectors.EVM)}
    />
  );
};

export { DappEVMSignInPage };
