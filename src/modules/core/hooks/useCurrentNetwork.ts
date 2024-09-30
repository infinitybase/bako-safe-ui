import { useNetwork } from '@fuels/react';
import { useState } from 'react';

import { UnknownIcon } from '@/components';
import { BakoIcon } from '@/components/icons/assets/bakoIcon';

export enum NetworkType {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
}

export const useCurrentNetwork = () => {
  const availableNetWorks = [
    {
      identifier: NetworkType.MAINNET,
      name: 'Mainnet',
      icon: BakoIcon,
    },
    {
      identifier: NetworkType.TESTNET,
      name: 'Testnet',
      icon: UnknownIcon,
    },
  ];

  const [selectedNetwork, setSelectedNetwork] = useState(
    availableNetWorks.find(
      ({ identifier }) => identifier === NetworkType.MAINNET,
    ),
  );

  const { network: fuelsNetwork } = useNetwork();

  // Mock to emulate a mainnet network
  // const fuelsNetwork = {
  //   url: 'https://app-mainnet.fuel.network',
  //   chainId: 'chainId',
  // };

  const network = fuelsNetwork ?? { url: import.meta.env.VITE_NETWORK };

  const checkNetwork = (type: NetworkType) => network?.url.includes(type);

  return {
    network,
    checkNetwork,
    selectedNetwork,
    setSelectedNetwork,
    availableNetWorks,
  };
};
