import { useMemo } from 'react';
import { useQuery } from 'react-query';

import { FueletIcon, FuelIcon } from '@/components';
import { FuelQueryKeys } from '@/modules/core/hooks/fuel/types';

import { useFuel } from './useFuel';

const DEFAULT_CONNECTORS = [
  {
    name: 'Fuel Wallet',
    icon: FuelIcon,
  },
  {
    name: 'Fuelet Wallet',
    icon: FueletIcon,
  },
];

const useListConnectors = () => {
  const [fuel] = useFuel();

  const query = useQuery(
    FuelQueryKeys.LIST_CONNECTOR,
    () => {
      return fuel.listConnectors();
    },
    {
      enabled: !!fuel,
    },
  );

  return {
    connectors: query.data,
    ...query,
  };
};

const useDefaultConnectors = () => {
  const { connectors, ...query } = useListConnectors();

  const defaultConnectors = useMemo(
    () =>
      DEFAULT_CONNECTORS.map((connector) => {
        const fuelConnector = connectors?.find(
          (c) => c.name === connector.name,
        );
        console.log({
          ...connector,
          imageUrl: fuelConnector?.imageUrl,
          isEnabled: !!fuelConnector,
        });
        return {
          ...connector,
          imageUrl: fuelConnector?.imageUrl,
          isEnabled: !!fuelConnector,
        };
      }),
    [connectors],
  );

  return {
    connectors: defaultConnectors,
    ...query,
  };
};

export { DEFAULT_CONNECTORS, useDefaultConnectors, useListConnectors };
