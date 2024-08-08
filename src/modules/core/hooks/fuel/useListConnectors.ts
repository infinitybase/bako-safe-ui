import { useConnectors } from '@fuels/react';

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

const useDefaultConnectors = () => {
  const { connectors, ...query } = useConnectors();

  const defaultConnectors = DEFAULT_CONNECTORS.map((connector) => {
    const fuelConnector = connectors?.find((c) => c.name === connector.name);
    const hasWebAuthn = !!window.navigator.credentials;
    const isWebAuthn = connector.name === EConnectors.WEB_AUTHN;
    const isEnabled =
      (!!fuelConnector && fuelConnector.installed) ||
      (isWebAuthn && hasWebAuthn);

    console.log('[CONNECTOR]: ', isEnabled, connector.name, fuelConnector);
    return {
      ...connector,
      imageUrl: undefined,
      isEnabled,
      refetchOnMount: false,
      staleTime: 500, // 500ms second to prevent request spam
    };
  });

  return {
    connectors: defaultConnectors,
    ...query,
  };
};

export { DEFAULT_CONNECTORS, useDefaultConnectors };
