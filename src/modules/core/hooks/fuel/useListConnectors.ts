import { useConnectors } from '@fuels/react';

import { FueletIcon, FuelIcon } from '@/components';

const DEFAULT_CONNECTORS = [
  // {
  //   name: EConnectors.WEB_AUTHN,
  //   icon: PasskeyIcon,
  // }, // desabled on this branch
  {
    name: 'Fuel Wallet',
    icon: FuelIcon,
  },
  {
    name: 'Fuelet Wallet',
    icon: FueletIcon,
  },
];

const useDefaultConnectors = () => {
  const { connectors, ...query } = useConnectors();

  const defaultConnectors = DEFAULT_CONNECTORS.map((connector) => {
    const fuelConnector = connectors?.find((c) => c.name === connector.name);

    return {
      ...connector,
      imageUrl: undefined,
      isEnabled: !!fuelConnector && fuelConnector.installed,
    };
  });

  return {
    connectors: defaultConnectors,
    ...query,
  };
};

export { DEFAULT_CONNECTORS, useDefaultConnectors };
