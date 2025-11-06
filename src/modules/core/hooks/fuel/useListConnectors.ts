import { useConnectors } from '@fuels/react';
import { TypeUser } from 'bakosafe';
import { useCallback } from 'react';

import { EvmIcon, FueletIcon, FuelIcon } from '@/components/icons/connectors';

export enum EConnectors {
  FUEL = 'Fuel Wallet',
  FULLET = 'Fuelet Wallet',
  WEB_AUTHN = 'Webauthn',
  EVM = 'EVM Wallet',
}

export const EConnectorsInverse: Record<EConnectors, keyof typeof TypeUser> = {
  'Fuel Wallet': 'FUEL',
  'Fuelet Wallet': 'FUEL',
  Webauthn: 'WEB_AUTHN',
  'EVM Wallet': 'EVM',
};

export enum EFuelConnectorsTypes {
  BAKO = 'Bako Safe',
  EVM = 'Ethereum Wallets',
  SOCIAL = 'Social Login',
}

export enum EConnectorsLabels {
  FUEL = 'Fuel Wallet',
  FUELET = 'Fuelet',
  EVM = 'Ethereum Wallet',
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
  {
    name: EConnectors.EVM,
    label: EConnectorsLabels.EVM,
    icon: EvmIcon,
  },
];

const useListConnectors = () => {
  const { connectors, ...query } = useConnectors();
  // const { connectors: wagmiConnectors } = wagmiUseConnect();

  const getFuelConnector = useCallback(
    (name: EConnectors) => {
      return connectors?.find((connector) => connector.name === name);
    },
    [connectors],
  );

  const getEvmConnector = (name: EConnectors) => {
    return name === EConnectors.EVM ? { installed: true } : null;
  };

  const defaultConnectors = DEFAULT_CONNECTORS.map((connector) => {
    const fuelConnector = getFuelConnector(connector.name);
    const evmConnector = getEvmConnector(connector.name);
    const isEnabled = !!fuelConnector?.installed || !!evmConnector?.installed;

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
