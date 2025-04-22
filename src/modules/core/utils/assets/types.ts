export type Attribute = {
  trait_type: string;
  value: string;
};

export type DefaultMetadata = {
  dna?: string;
  date?: number;
  name?: string;
  image?: string;
  edition?: number;
  compiler?: string;
  attributes?: Attribute[];
  description?: string;
  [key: string]: any;
};

export type AssetMap = {
  [assetId: string]: {
    symbol?: string;
    collection?: string;
    metadata: DefaultMetadata;
    name: string;
    slug: string;
    units: number;
    icon?: string;
    assetId: string;
    isNFT?: boolean;
    totalSupply?: string;
    contractId?: string;
    description?: string;
  };
};

export type Asset = {
  name: string;
  slug: string;
  assetId: string;
  icon?: string;
  amount?: string;
  units: number;
  metadata?: DefaultMetadata;
};

export type NFT = {
  name: string;
  assetId: string;
  symbol?: string;
  collection?: string;
  contractId?: string;
  metadata?: DefaultMetadata;
};
