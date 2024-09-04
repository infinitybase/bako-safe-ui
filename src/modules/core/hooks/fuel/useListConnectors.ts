import { useConnectors } from '@fuels/react';
import { useCallback } from 'react';

import { FueletIcon, FuelIcon } from '@/components';
import { PasskeyIcon } from '@/components/icons/passkey-icon';

export enum EConnectors {
  FUEL = 'Fuel Wallet',
  FULLET = 'Fuelet Wallet',
  WEB_AUTHN = 'Login With Passkey',
}

export enum EConnectorsLabels {
  FUEL = 'Fuel Wallet',
  FUELET = 'Fuelet',
  WEB_AUTHN = 'Login With Passkey',
}

const DEFAULT_CONNECTORS = [
  {
    name: EConnectors.WEB_AUTHN,
    label: EConnectorsLabels.WEB_AUTHN,
    icon: PasskeyIcon,
  },
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

  const isConnectorEnabled = useCallback(
    (name: EConnectors, installed: boolean) => {
      if (name === EConnectors.WEB_AUTHN) {
        return installed || !!window.navigator.credentials;
      }

      return installed;
    },
    [],
  );

  const defaultConnectors = DEFAULT_CONNECTORS.map((connector) => {
    const fuelConnector = getFuelConnector(connector.name);
    const isEnabled = isConnectorEnabled(
      connector.name,
      !!fuelConnector?.installed,
    );

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
