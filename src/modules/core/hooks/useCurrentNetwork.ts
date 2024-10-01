import { UnknownIcon } from '@/components';
import { BakoIcon } from '@/components/icons/assets/bakoIcon';
import { useChangeNetworkRequest } from '@/modules/auth/hooks/useChangeNetwork';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

export enum NetworkType {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
  LOCALHOST = 'localhost',
  LOCALSTORAGE = 'localstorage',
}

export const useCurrentNetwork = () => {
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
            identifier: NetworkType.LOCALHOST,
            name: 'Local',
            icon: UnknownIcon,
            url: 'http://localhost:4000/v1/graphql',
          },
        ]
      : []),
  ];

  const addedNetWorks = [
    {
      identifier: NetworkType.LOCALSTORAGE,
      name: 'Custom Network 1',
      icon: BakoIcon,
      url: 'https://localhost.fuel.network', // Como devem ser as urls das redes localstorage
    },
    {
      identifier: NetworkType.LOCALSTORAGE,
      name: 'Custom Network 2',
      icon: BakoIcon,
      url: 'https://localhost.fuel.network', // Como devem ser as urls das redes localstorage
    },
  ];

  const {
    authDetails: {
      userInfos: { network: userNetwork },
    },
  } = useWorkspaceContext();

  // const userNetwork = {
  //   url: import.meta.env.VITE_NETWORK,
  //   chainId: import.meta.env.CHAIN_ID,
  // };

  const changeNetworkRequest = useChangeNetworkRequest();

  const handleUpdateNetwork = async (url: string) => {
    console.log('🚀 ~ handleUpdateNetwork ~ url:', url);

    changeNetworkRequest.mutate(
      { url },
      {
        onSuccess: () => {
          console.log(`🚀 onSuccess`);
          // TODO:  Invalidate all queries
          // queryClient.invalidateQueries({
          //   queryKey: [LATEST_INFO_QUERY_KEY],
          // });
        },
      },
    );
  };

  // Mock to emulate a mainnet network
  // const fuelsNetwork = {
  //   url: 'https://app-mainnet.fuel.network',
  //   chainId: 'chainId',
  // };

  const currentNetwork = userNetwork ?? {
    url: import.meta.env.VITE_NETWORK,
    chainId: import.meta.env.CHAIN_ID,
  };

  console.log('🚀 ~ useCurrentNetwork ~ network:', currentNetwork);

  const checkNetwork = (type: NetworkType) =>
    currentNetwork?.url.includes(type);

  return {
    currentNetwork,
    checkNetwork,
    handleUpdateNetwork,
    availableNetWorks,
    addedNetWorks,
  };
};
