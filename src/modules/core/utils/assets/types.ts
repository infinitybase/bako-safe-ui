export type Attribute = {
  trait_type: string;
  value: string;
};

export type defaultMetadata = {
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
    metadata: defaultMetadata;
    name: string;
    slug: string;
    units: number;
    icon?: string;
    assetId: string;
    isNFT?: boolean;
    totalSupply?: string;
  };
};

export type Asset = {
  name: string;
  slug: string;
  assetId: string;
  icon?: string;
  amount?: string;
  units: number;
  metadata?: defaultMetadata;
};

export type NFT = {
  name: string;
  assetId: string;
  metadata?: defaultMetadata;
};
