import { useDisclosure } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Pages, useDidMountEffect, useFuelConnection } from '@/modules/core';

const useSignIn = () => {
  const navigate = useNavigate();
  const networkDialog = useDisclosure();

  const { connect, isConnecting, isConnected, isValidAccount, network } =
    useFuelConnection();

  const goToApp = () => {
    if (isConnected) {
      return navigate(Pages.home());
    }

    connect();
  };

  const isBeta3 = useMemo(() => {
    if (network.includes('localhost')) {
      return true;
    }

    return network === import.meta.env.VITE_NETWORK_BETA_3;
  }, [network]);

  useDidMountEffect(() => {
    if (!isBeta3) {
      networkDialog.onOpen();
      return;
    }

    connect();
  }, [connect, isBeta3]);

  return {
    isConnected,
    isConnecting,
    connect,
    isValidAccount,
    goToApp,
    isBeta3,
    networkDialog,
  };
};

export { useSignIn };
