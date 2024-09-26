export type AssetMap = {
  [assetId: string]: {
    name: string;
    slug: string;
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
};
