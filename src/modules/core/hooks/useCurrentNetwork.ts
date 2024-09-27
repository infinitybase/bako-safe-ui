import { useNetwork } from '@fuels/react';

export enum NetworkType {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
}

export const useCurrentNetwork = () => {
  const { network: fuelsNetwork } = useNetwork();

  // const network = {
  //   url: 'https://app-mainnet.fuel.network',
  //   chainId: '071234',
  // };

  const network = fuelsNetwork ?? { url: import.meta.env.VITE_NETWORK };

  const checkNetwork = (type: NetworkType) => network?.url.includes(type);

  return {
    network,
    checkNetwork,
  };
};
