import { Provider } from "fuels";

import { localStorageKeys } from "@/modules/auth";
import { AxiosInstance } from "axios";
import { bindMethods } from "@/utils/bindMethods";
import { NetworkType } from "@/types";

export enum NetworkQueryKey {
  CREATE_NETWORK = "create-network",
  LIST_NETWORKS = "list-networks",
  SELECT_NETWORK = "select-network",
  DELETE_NETWORK = "delete-network",
  CHECK_NETWORK = "check-network",
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
export type SelectNetworkResponse = boolean;
export type CheckNetworkResponse = string | undefined;

export const availableNetWorks = {
  [NetworkType.MAINNET]: {
    name: "Ignition",
    url: process.env.MAINNET_NETWORK! ?? "",
    chainId: 9889,
    explorer: "https://app-mainnet.fuel.network/",
  },
  [NetworkType.TESTNET]: {
    name: "Fuel Sepolia Testnet",
    url: "https://testnet.fuel.network/v1/graphql",
    chainId: 0,
    explorer: "https://app-testnet.fuel.network/",
  },
  ...(window.location.hostname.includes("localhost") && {
    [NetworkType.DEV]: {
      name: "Local",
      url: "http://localhost:4000/v1/graphql",
      chainId: 0,
      explorer: "http://localhost:4000/explorer",
    },
  }),
};

const sanitizeNetwork = (url: string = "") =>
  url.replace(/^https?:\/\/[^@]+@/, "https://");

export class NetworkService {
  api: AxiosInstance;
  appVersion: string;

  constructor(api: AxiosInstance, appVersion: string) {
    this.api = api;
    this.appVersion = appVersion;
    bindMethods(this);
  }

  syncAvailableNetworks() {
    const storedVersion = localStorage.getItem("appVersion");
    if (storedVersion !== this.appVersion) {
      localStorage.setItem("appVersion", this.appVersion);
      localStorage.setItem(
        localStorageKeys.NETWORKS,
        JSON.stringify(Object.values(availableNetWorks)),
      );
    }
  }

  async create(newNetwork: CustomNetwork) {
    const networks: CustomNetwork[] = JSON.parse(
      localStorage.getItem(localStorageKeys.NETWORKS) ?? "[]",
    );

    if (this.hasNetwork(newNetwork.url)) return;

    localStorage.setItem(
      localStorageKeys.NETWORKS,
      JSON.stringify([...networks, newNetwork]),
    );
  }

  list() {
    this.syncAvailableNetworks();
    const networks: CustomNetwork[] = JSON.parse(
      localStorage.getItem(localStorageKeys.NETWORKS) ?? "[]",
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

  async delete({ url }: DeleteNetworkPayload) {
    const existingNetworks: CustomNetwork[] = JSON.parse(
      localStorage.getItem(localStorageKeys.NETWORKS) ?? "[]",
    );

    const filtered = existingNetworks?.filter((net) => net.url !== url);

    localStorage.setItem(localStorageKeys.NETWORKS, JSON.stringify(filtered));
  }

  async selectNetwork({ url }: SelectNetworkPayload) {
    const { data } = await this.api.post<SelectNetworkResponse>(
      `/user/select-network/`,
      { network: url },
    );

    return data;
  }

  async check({ url }: CheckNetworkPayload) {
    const provider = await Provider.create(url);

    const chain = provider.getChain();

    return chain?.name;
  }

  hasNetwork(url: string) {
    const networks = this.list();
    return networks.some(
      (net) => sanitizeNetwork(net.url) === sanitizeNetwork(url),
    );
  }

  findByUrl(url: string) {
    this.syncAvailableNetworks();
    const networks = this.list();
    return networks.find(
      (net) => sanitizeNetwork(net.url) === sanitizeNetwork(url),
    );
  }

  getName(url: string) {
    const network = this.findByUrl(url);
    return network?.name ?? "Unknown";
  }

  getExplorer(url: string) {
    const network = this.findByUrl(url);

    if (network && "explorer" in network && network.explorer) {
      return network.explorer;
    }

    const defaultNetwork = availableNetWorks[NetworkType.MAINNET];
    return defaultNetwork.explorer;
  }
}
