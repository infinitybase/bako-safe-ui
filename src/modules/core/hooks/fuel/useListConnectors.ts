import { useConnectors } from '@fuels/react';

import { FueletIcon, FuelIcon } from '@/components';
import { PasskeyIcon } from '@/components/icons/passkey-icon';

export enum EConnectors {
  FUEL = 'Fuel Wallet',
  FULLET = 'Fuelet Wallet',
  WEB_AUTHN = 'Login With Passkey',
}

const DEFAULT_CONNECTORS = [
  {
    name: EConnectors.WEB_AUTHN,
    icon: PasskeyIcon,
    isBeta: true,
  },
  {
    name: EConnectors.FUEL,
    icon: FuelIcon,
    isBeta: false,
  },
  {
    name: EConnectors.FULLET,
    icon: FueletIcon,
    isBeta: false,
  },
];

const useDefaultConnectors = () => {
  const { connectors, ...query } = useConnectors();

  const defaultConnectors = DEFAULT_CONNECTORS.map((connector) => {
    const fuelConnector = connectors?.find((c) => c.name === connector.name);
    const hasWebAuthn = !!window.navigator.credentials;
    const isWebAuthn = connector.name === EConnectors.WEB_AUTHN;
    return {
      ...connector,
      imageUrl: undefined,
      isEnabled:
        (!!fuelConnector && fuelConnector.installed) ||
        (isWebAuthn && hasWebAuthn),
    };
  });

  return {
    connectors: defaultConnectors,
    ...query,
  };
};

export { DEFAULT_CONNECTORS, useDefaultConnectors };
