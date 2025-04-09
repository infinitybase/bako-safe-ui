import { Network } from 'fuels';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useContactToast } from '@/modules/addressBook';
import { useQueryParams } from '@/modules/auth/hooks';
import { SocketEvents, SocketUsernames, useSocket } from '@/modules/core/hooks';
import { availableNetWorks, NetworkType } from '@/modules/network/services';

import { useChangeNetworkRequest } from './useChangeNetworkRequest';

interface IVaultEvent {
  name: string;
  address: string;
  description: string;
  provider: string;
}

interface IDappEvent {
  name: string;
  description: string;
  origin: string;
  network: Network;
}

interface IHandleInfos {
  vault: IVaultEvent;
  dapp: IDappEvent;
  currentNetwork: Network;
}

interface InfoPage {
  currentNetworkName: string;
  currentNetworkUrl: string;
  dappNetworkName: string;
  dappNetworkUrl: string;
  dappOrigin: string;
}

export type UseSwitchNetworkSocket = ReturnType<typeof useSwitchNetworkSocket>;

export const useSwitchNetworkSocket = () => {
  const vaultRef = useRef<IVaultEvent>({
    name: '',
    address: '',
    description: '',
    provider: '',
  });

  const dappRef = useRef<IDappEvent>({
    name: '',
    description: '',
    origin: '',
    network: {
      url: '',
      chainId: 0,
    },
  });

  const currentNetworkRef = useRef<Network>({
    url: '',
    chainId: 0,
  });

  const { socket, isConnected } = useSocket();
  const { sessionId, request_id } = useQueryParams();
  const sendRequest = useChangeNetworkRequest();
  const { errorToast } = useContactToast();
  const [infoPage, setInfoPage] = useState<InfoPage>({} as InfoPage);
  const [isSwitching, setIsSwitching] = useState(false);
  const connectionAttemptedRef = useRef(false);

  const isLoadingInfo = Object.keys(infoPage).length === 0;

  const handlerInfos = useCallback((data: IHandleInfos) => {
    const currentNetworkName = getNetworkname(data.currentNetwork.url);
    const currentNetworkUrl = getHostname(data.currentNetwork.url);
    const dappNetworkName = getNetworkname(data.dapp.network.url);
    const dappNetworkUrl = getHostname(data.dapp.network.url);
    const dappOrigin = getHostname(data.dapp.origin);

    setInfoPage({
      currentNetworkName,
      currentNetworkUrl,
      dappNetworkName,
      dappNetworkUrl,
      dappOrigin,
    });
  }, []);

  const handleGetInfoData = useCallback(
    (data: any) => {
      console.log('GETTING_NETWORK_DATA');
      const { data: content } = data;
      const { vault, dapp, currentNetwork } = content;

      vaultRef.current = vault;
      dappRef.current = dapp;
      currentNetworkRef.current = currentNetwork;

      handlerInfos({ vault, dapp, currentNetwork });
    },
    [handlerInfos],
  );

  const handleSocketEvent = useCallback(
    (data: any) => {
      console.log('SOCKET EVENT DATA SWITCH NETWORK:', data);
      if (data.to !== SocketUsernames.UI) return;

      switch (data.type) {
        case SocketEvents.CHANGE_NETWORK:
          handleGetInfoData(data);
          break;
        default:
          break;
      }
    },
    [handleGetInfoData],
  );

  const getNetworkname = (url: string) => {
    if (url.includes('localhost')) {
      return availableNetWorks[NetworkType.DEV]?.name ?? '';
    }

    if (getHostname(url) === 'devnet.fuel.network') {
      return 'Fuel Sepolia Devnet';
    }

    if (url === availableNetWorks[NetworkType.TESTNET].url) {
      return availableNetWorks[NetworkType.TESTNET]?.name ?? '';
    }

    return availableNetWorks[NetworkType.MAINNET]?.name ?? '';
  };

  const getHostname = (url?: string) => {
    if (!url) return '';
    return new URL(url).hostname;
  };

  const redirectToDapp = (url: string) => {
    window.open(`${url}`, '_BLANK');
  };

  const onSuccessChangeNetwork = async (data: Network) => {
    console.log('[EMITTING NETWORK CHANGED]');
    socket.emit(SocketEvents.NETWORK_CHANGED, { network: data });

    setIsSwitching(false);
  };

  const sendNetworkRequest = async (dapp: IDappEvent) => {
    if (!sessionId) {
      errorToast({
        title: 'Session id not found',
        description: 'Please try again!',
      });
      return;
    }

    setIsSwitching(true);

    sendRequest.mutate(
      { newNetwork: dapp.network, origin: dapp.origin, sessionId },
      {
        onSuccess: (data) => {
          onSuccessChangeNetwork(data);
        },
        onError: () => {
          setIsSwitching(false);
          errorToast({
            title: 'Change network failed',
            description: 'Please try again!',
          });
        },
      },
    );
  };

  useEffect(() => {
    if (!isConnected) return;

    if (!connectionAttemptedRef.current) {
      socket.emit(SocketEvents.DEFAULT, {
        sessionId,
        to: SocketUsernames.CONNECTOR,
        request_id,
        type: SocketEvents.CONNECTED,
        data: {},
      });
      socket.on(SocketEvents.DEFAULT, handleSocketEvent);
      connectionAttemptedRef.current = true;
    }
    return () => {
      socket.off(SocketEvents.DEFAULT, handleSocketEvent);
    };
  }, [socket, isConnected]);

  return {
    vault: vaultRef.current,
    dapp: dappRef.current,
    currentNetwork: currentNetworkRef.current,
    isLoadingInfo,
    isSwitching,
    infoPage,
    getHostname,
    redirectToDapp,
    getNetworkname,
    sendNetworkRequest,
    socket,
  };
};
