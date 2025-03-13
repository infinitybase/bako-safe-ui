export type AssetMap = {
  [assetId: string]: {
    metadata: any;
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
  metadata?: any;
};

export type NFT = {
  amount: string;
  assetId: string;
  metadata?: any;
};
