import { useConnectors } from '@fuels/react';
import { TypeUser } from 'bakosafe';
import { useCallback } from 'react';

import { FueletIcon, FuelIcon } from '@/components/icons/connectors';

export enum EConnectors {
  FUEL = 'Fuel Wallet',
  FULLET = 'Fuelet Wallet',
  WEB_AUTHN = 'Webauthn',
}

export const EConnectorsInverse: Record<EConnectors, keyof typeof TypeUser> = {
  'Fuel Wallet': 'FUEL',
  'Fuelet Wallet': 'FUEL',
  Webauthn: 'WEB_AUTHN',
};

export enum EConnectorsLabels {
  FUEL = 'Fuel Wallet',
  FUELET = 'Fuelet',
}

const DEFAULT_CONNECTORS = [
  {
    name: EConnectors.FUEL,
    label: EConnectorsLabels.FUEL,
    icon: FuelIcon,
  },
  {
    name: EConnectors.FULLET,
    label: EConnectorsLabels.FUELET,
    icon: FueletIcon,
  },
];

const useListConnectors = () => {
  const { connectors, ...query } = useConnectors();

  const getFuelConnector = useCallback(
    (name: EConnectors) => {
      return connectors?.find((connector) => connector.name === name);
    },
    [connectors],
  );

  const defaultConnectors = DEFAULT_CONNECTORS.map((connector) => {
    const fuelConnector = getFuelConnector(connector.name);
    const isEnabled = !!fuelConnector?.installed;

    return {
      ...connector,
      imageUrl: undefined,
      isEnabled,
      refetchOnMount: false,
    };
  });

  return {
    connectors: defaultConnectors,
    ...query,
  };
};

export { DEFAULT_CONNECTORS, useListConnectors };
