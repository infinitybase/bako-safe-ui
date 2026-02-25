import { Provider } from 'fuels';

import { api } from '@/config';
import { localStorageKeys } from '@/modules/auth/services';

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
}

export type CustomNetwork = {
  name: string;
  url: string;
  chainId: number;
};

export type CreateNetworkPayload = CustomNetwork;

export type DeleteNetworkPayload = {
  url: string;
};

export type SelectNetworkPayload = {
  url?: string;
};

export type CheckNetworkPayload = {
  url: string;
};

export type CreateNetworkResponse = void;
export type DeleteNetworkResponse = void;
export type SelectNetworkResponse = {
  network: CustomNetwork;
};
export type CheckNetworkResponse = string | undefined;

const appVersion = import.meta.env.VITE_APP_VERSION;

export const availableNetWorks = {
  [NetworkType.MAINNET]: {
    name: 'Ignition',
    url: import.meta.env.VITE_MAINNET_NETWORK,
    chainId: 9889,
    explorer: 'https://app-mainnet.fuel.network/',
  },
  [NetworkType.TESTNET]: {
    name: 'Fuel Sepolia Testnet',
    url: 'https://testnet.fuel.network/v1/graphql',
    chainId: 0,
    explorer: 'https://app-testnet.fuel.network/',
  },
  ...(window.location.hostname.includes('localhost') && {
    [NetworkType.DEV]: {
      name: 'Local',
      url: 'http://localhost:4000/v1/graphql',
      chainId: 0,
      explorer: 'http://localhost:4000/explorer',
    },
  }),
};

const sanitizeNetwork = (url: string = '') =>
  url.replace(/^https?:\/\/[^@]+@/, 'https://');

export class NetworkService {
  static syncAvailableNetworks() {
    const storedVersion = localStorage.getItem('appVersion');
    if (storedVersion !== appVersion) {
      localStorage.setItem('appVersion', appVersion);
      localStorage.setItem(
        localStorageKeys.NETWORKS,
        JSON.stringify(Object.values(availableNetWorks)),
      );
    }
  }

  static async create(newNetwork: CustomNetwork) {
    const networks: CustomNetwork[] = JSON.parse(
      localStorage.getItem(localStorageKeys.NETWORKS) ?? '[]',
    );

    if (NetworkService.hasNetwork(newNetwork.url)) return;

    localStorage.setItem(
      localStorageKeys.NETWORKS,
      JSON.stringify([...networks, newNetwork]),
    );
  }

  static list() {
    NetworkService.syncAvailableNetworks();
    const networks: CustomNetwork[] = JSON.parse(
      localStorage.getItem(localStorageKeys.NETWORKS) ?? '[]',
    );

    if (!networks.length) {
      localStorage.setItem(
        localStorageKeys.NETWORKS,
        JSON.stringify(Object.values(availableNetWorks)),
      );

      return Object.values(availableNetWorks);
    }

    const uniqueNetworks = networks.filter(
      (network, index, self) =>
        index ===
        self.findIndex(
          (t) => sanitizeNetwork(t.url) === sanitizeNetwork(network.url),
        ),
    );
    return uniqueNetworks;
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
    const provider = new Provider(url);

    const chain = await provider.getChain();

    return chain?.name;
  }

  static hasNetwork(url: string) {
    const networks = NetworkService.list();
    return networks.some(
      (net) => sanitizeNetwork(net.url) === sanitizeNetwork(url),
    );
  }

  static findByUrl(url: string) {
    NetworkService.syncAvailableNetworks();
    const networks = NetworkService.list();
    return networks.find(
      (net) => sanitizeNetwork(net.url) === sanitizeNetwork(url),
    );
  }

  static getName(url: string) {
    const network = NetworkService.findByUrl(url);
    return network?.name ?? 'Unknown';
  }

  static getExplorer(url: string) {
    const network = NetworkService.findByUrl(url);

    if (network && 'explorer' in network && network.explorer) {
      return network.explorer;
    }

    const defaultNetwork = availableNetWorks[NetworkType.MAINNET];
    return defaultNetwork.explorer;
  }
}
