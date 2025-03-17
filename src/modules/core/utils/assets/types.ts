export type defaultMetadata = {
  [key: string]: string;
};
export type AssetMap = {
  [assetId: string]: {
    metadata: defaultMetadata;
    name: string;
    slug: string;
    units: number;
    icon?: string;
    assetId: string;
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
  amount: string;
  assetId: string;
  metadata?: defaultMetadata;
};
