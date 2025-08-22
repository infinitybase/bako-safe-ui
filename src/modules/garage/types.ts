import { AssetInfo } from 'fuels';

export interface AssetNetwork {
  type: string;
  chain: string;
  decimals: number;
  chainId: number;
  __typename: string;
  assetId?: string;
}

export interface Metadata {
  [key: string]: string;
}

export interface FuelAsset {
  amount: string;
  assetId: string;
  owner: string;
  name: string | null;
  symbol: string | null;
  decimals: number;
  suspicious: boolean;
  verified: boolean;
  icon?: string;
  networks?: AssetNetwork[];
  isNFT?: boolean;
  metadata?: Metadata;
  uri?: string;
  contractId?: string;
  subId?: string;
  collection?: string;
  rate: number;
}

export interface Asset {
  id: string;
  metadata: AssetInfo | null;
  fees: [string, string];
  __typename: 'Asset';
}

export interface OrderFromFuel {
  __typename: 'Order';
  id: string;
  asset: (FuelAsset & { id: string }) | null;
  amount: string;
  seller: string;
  itemPrice: string;
  itemAsset: string;
  status: string;
  nft: {
    id: string;
    metadata: Record<string, string> & Metadata;
    contractId?: string;
    edition?: string;
    name?: string | null;
    image?: string;
    description?: string;
    fuelMetadata?: FuelAsset | null;
  };
}

export interface Order {
  asset: {
    id: string;
    image: string;
    name: string;
  };
  buyer: string | null;
  createdAt: string;
  id: string;
  price: {
    amount: number;
    assetId: string;
    image: string;
    name: string;
    symbol: string;
    usd: number;
    raw: string;
  };
  seller: string;
  status: number;
  updatedAt: string;
  processing?: boolean;
}

export interface OrderWithMedatada {
  id: string;
  status: number;
  collection: {
    address: string;
    name: string;
  };
  seller: string;
  buyer: string;
  network: number;
  createdAt: string;
  updatedAt: string;
  price: {
    amount: number;
    raw: string;
    usd: number;
    name: string;
    symbol: string;
    assetId: string;
    image: string;
  };
  asset: {
    id: string;
    name: string;
    image: string;
    subId: string;
    metadata: {
      name: string;
      image: string;
      compiler: string;
      metadata: string;
      attributes: Array<{
        value: string;
        trait_type: string;
      }>;
      description: string;
      external_url: string;
    };
  };
}

export interface Nft {
  metadata: Record<string, string>;
  contractId?: string;
  id: string;
  edition?: string;
  name?: string | null;
  image?: string;
  description?: string;
}

export enum OrderStatus {
  CREATED = 'CREATED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export type GaragePaginatedResponse<T> = {
  data: {
    items: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
};

export type GaragePaginatedResponseUserOrders<T> = {
  data: {
    items: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    totalOrdersUsdPrice: number;
    notListedTotalUsdPrice: number;
  };
};
