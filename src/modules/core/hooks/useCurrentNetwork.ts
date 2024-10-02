import { useMutation } from '@tanstack/react-query';
import { Provider } from 'fuels';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { UnknownIcon } from '@/components';
import { BakoIcon } from '@/components/icons/assets/bakoIcon';
import { useChangeNetworkRequest } from '@/modules/auth/hooks/useChangeNetwork';
import { localStorageKeys } from '@/modules/auth/services';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

export enum NetworkType {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
  DEV = 'dev',
  LOCALSTORAGE = 'localstorage',
}

export enum NetworkDrawerMode {
  SELECT = 'select',
  ADD = 'add',
  CONFIRM = 'confirm',
}

export type CustomNetwork = { name: string; url: string };

export const useCurrentNetwork = (onClose?: () => void) => {
  const [validNetwork, setValidNetwork] = useState(false);
  const [mode, setMode] = useState<NetworkDrawerMode>(NetworkDrawerMode.SELECT);

  const networkForm = useForm<CustomNetwork>();
  const networkHealthCheckRequest = useMutation({
    mutationKey: ['network-health-check'],
    mutationFn: async (url: string) => {
      const teste = await Provider.create(url);

      const testando = teste.getChain();
      console.log('🚀 ~ mutationFn: ~ testando:', testando);

      return {};
    },
  });

  const {
    authDetails: {
      userInfos: { network: userNetwork },
    },
    resetHomeRequests,
  } = useWorkspaceContext();
  const selectNetworkRequest = useChangeNetworkRequest();

  const availableNetWorks = [
    {
      identifier: NetworkType.MAINNET,
      name: 'Mainnet',
      icon: BakoIcon,
      url: 'https://bako:LR2RU3jQHPlbqog3tnDmZw@mainnet.fuel.network/v1/graphql',
      // url: 'https://app-mainnet.fuel.network',
    },
    {
      identifier: NetworkType.TESTNET,
      name: 'Testnet',
      icon: UnknownIcon,
      url: 'https://testnet.fuel.network/v1/graphql',
    },
    ...(import.meta.env.VITE_DEV === 'development'
      ? [
          {
            identifier: NetworkType.DEV,
            name: 'Local',
            icon: UnknownIcon,
            url: 'http://localhost:4000/v1/graphql',
          },
        ]
      : []),
  ];

  const getCustomNetworks = (): CustomNetwork[] =>
    JSON.parse(localStorage.getItem(localStorageKeys.NETWORKS) ?? '[]');

  const handleAddNetwork = networkForm.handleSubmit((data) => {
    if (!data.url)
      networkForm.setError('url', {
        type: 'required',
        message: 'Url is required.',
      });

    if (!data.name)
      networkForm.setError('name', {
        type: 'required',
        message: 'Name is required.',
      });

    localStorage.setItem(
      localStorageKeys.NETWORKS,
      JSON.stringify([...getCustomNetworks(), { ...data }]),
    );

    setMode(NetworkDrawerMode.SELECT);
    setValidNetwork(false);
    networkForm.reset();
  });

  const handleDeleteCustomNetwork = ({ name, url }: CustomNetwork) => {
    const filtered = getCustomNetworks().filter(
      (net) => net.url !== url && net.name !== name,
    );

    localStorage.setItem(localStorageKeys.NETWORKS, JSON.stringify(filtered));
  };

  const handleSelectNetwork = async (url: string) => {
    selectNetworkRequest.mutate(
      { url },
      {
        onSuccess: () => {
          onClose?.();
          resetHomeRequests();
        },
      },
    );
  };

  const handleTestNetwork = networkForm.handleSubmit(async (data) => {
    if (!data.url) {
      networkForm.setError('url', {
        type: 'required',
        message: 'Url is required',
      });
    }

    networkHealthCheckRequest.mutate(data.url, {
      onSuccess: () => setValidNetwork(true),
    });
  });

  const currentNetwork = userNetwork ?? {
    url: import.meta.env.VITE_NETWORK,
    chainId: import.meta.env.CHAIN_ID,
  };

  const checkNetwork = (type: NetworkType) =>
    currentNetwork?.url.includes(type);

  const handleClose = () => {
    setMode(NetworkDrawerMode.SELECT);
    setValidNetwork(false);
    onClose?.();
  };

  return {
    currentNetwork,
    checkNetwork,
    handleSelectNetwork,
    handleAddNetwork,
    handleDeleteCustomNetwork,
    handleTestNetwork,
    handleClose,
    networkHealthCheckRequest,
    validNetwork,
    networkForm,
    mode,
    setMode,
    availableNetWorks: [
      ...availableNetWorks,
      ...getCustomNetworks().map((net) => ({
        ...net,
        identifier: NetworkType.LOCALSTORAGE,
        icon: BakoIcon,
      })),
    ],
    selectNetworkRequest,
  };
};
