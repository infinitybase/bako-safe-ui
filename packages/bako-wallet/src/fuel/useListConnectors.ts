import { FueletIcon, FuelIcon } from '@bako-safe/ui';
import { useConnectors } from '@fuels/react';
import { TypeUser } from 'bakosafe';
import { useCallback } from 'react';

enum EConnectors {
  FUEL = 'Fuel Wallet',
  FULLET = 'Fuelet Wallet',
  WEB_AUTHN = 'Webauthn',
}

const EConnectorsInverse: Record<EConnectors, keyof typeof TypeUser> = {
  'Fuel Wallet': 'FUEL',
  'Fuelet Wallet': 'FUEL',
  Webauthn: 'WEB_AUTHN',
};

enum EConnectorsLabels {
  FUEL = 'Fuel Wallet',
  FUELET = 'Fuelet',
}

export type IConnector = {
  name: EConnectors;
  label: EConnectorsLabels;
  icon: any;
};

export type ConnectorItem = IConnector & {
  imageUrl?: string;
  isEnabled: boolean;
  refetchOnMount: boolean;
};

export type UseListConnectorsResult = {
  connectors: ConnectorItem[];
  error: Error | null;
  isError: boolean;
  isPending: boolean;
  isLoading: boolean;
  isLoadingError: boolean;
  isRefetchError: boolean;
  isSuccess: boolean;
  status: 'error' | 'success';
};

const DEFAULT_CONNECTORS: IConnector[] = [
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

const useListConnectors = (): UseListConnectorsResult => {
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
    error: query.error ?? null,
    isError: query.isError,
    isPending: false,
    isLoading: query.isLoading,
    isLoadingError: query.isLoadingError,
    isRefetchError: query.isRefetchError,
    isSuccess: query.isSuccess,
    status: query.status,
  };
};

export {
  DEFAULT_CONNECTORS,
  EConnectors,
  EConnectorsInverse,
  EConnectorsLabels,
  useListConnectors,
};
