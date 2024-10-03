import { Provider } from 'fuels';

import { api } from '@/config';
import { localStorageKeys } from '@/modules/auth/services';

// import { availableNetWorks } from '../data';

export enum NetworkQueryKey {
  CREATE_NETWORK = 'create-network',
  LIST_NETWORKS = 'list-networks',
  SELECT_NETWORK = 'select-network',
  DELETE_NETWORK = 'delete-network',
  CHECK_NETWORK = 'check-network',
}

export enum NetworkType {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
  DEV = 'dev',
  LOCALSTORAGE = 'localstorage',
}

export type CustomNetwork = {
  name: string;
  url: string;
  chainId: number;
  identifier: NetworkType;
};

export type CreateNetworkPayload = CustomNetwork;

export type DeleteNetworkPayload = {
  url: string;
};

export type SelectNetworkPayload = {
  url: string;
};

export type CheckNetworkPayload = {
  url: string;
};

export type CreateNetworkResponse = void;
export type DeleteNetworkResponse = void;
export type SelectNetworkResponse = boolean;
export type CheckNetworkResponse = string | undefined;

export const availableNetWorks = [
  {
    identifier: NetworkType.MAINNET,
    name: 'Mainnet',
    url: 'https://bako:LR2RU3jQHPlbqog3tnDmZw@mainnet.fuel.network/v1/graphql',
  },
  {
    identifier: NetworkType.TESTNET,
    name: 'Testnet',
    url: 'https://testnet.fuel.network/v1/graphql',
  },
  ...(import.meta.env.VITE_DEV === 'development'
    ? [
        {
          identifier: NetworkType.DEV,
          name: 'Local',
          url: 'http://localhost:4000/v1/graphql',
        },
      ]
    : []),
];

export class NetworkService {
  static async create(newNetwork: CustomNetwork) {
    const networks = JSON.parse(
      localStorage.getItem(localStorageKeys.NETWORKS) ?? '[]',
    );

    localStorage.setItem(
      localStorageKeys.NETWORKS,
      JSON.stringify([...networks, newNetwork]),
    );
  }

  static async list() {
    const networks: CustomNetwork[] = JSON.parse(
      localStorage.getItem(localStorageKeys.NETWORKS) ?? '[]',
    );

    if (!networks.length) {
      localStorage.setItem(
        localStorageKeys.NETWORKS,
        JSON.stringify(availableNetWorks),
      );

      return availableNetWorks;
    }

    return networks;
  }

  static async delete({ url }: DeleteNetworkPayload) {
    const existingNetworks: CustomNetwork[] = JSON.parse(
      localStorage.getItem(localStorageKeys.NETWORKS) ?? '[]',
    );

    const filtered = existingNetworks?.filter((net) => net.url !== url);

    localStorage.setItem(localStorageKeys.NETWORKS, JSON.stringify(filtered));
  }

  static async selectNetwork({ url }: SelectNetworkPayload) {
    const { data } = await api.post<SelectNetworkResponse>(
      `/user/select-network/`,
      { network: url },
    );

    return data;
  }

  static async check({ url }: CheckNetworkPayload) {
    const provider = await Provider.create(url);

    const chain = provider.getChain();

    return chain?.name;
  }
}
