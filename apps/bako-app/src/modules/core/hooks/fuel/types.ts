import { ChainInfo } from 'fuels';

export enum FuelQueryKeys {
  CURRENT_ACCOUNT = 'fuel/current-account',
  IS_CONNECTED = 'fuel/is-connected',
  CONNECT = 'fuel/connect',
  DISCONNECT = 'fuel/dicconnect',
  WALLET = 'fuel/wallet',
  PROVIDER = 'fuel/provider',
  NETWORK = 'fuel/netowrk',
  CURRENT_CONNECTOR = 'fuel/current-connector',
  LIST_CONNECTOR = 'fuel/list-connector',
  CACHED_NETWORKS = 'fuel/cached-networks',
}

export type FuelChainInfo = ChainInfo & { url: string };
