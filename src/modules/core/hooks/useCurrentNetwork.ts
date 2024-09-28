import { useNetwork } from '@fuels/react';

export enum NetworkType {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
}

export const useCurrentNetwork = () => {
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
  };
};
