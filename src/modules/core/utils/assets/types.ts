export type AssetMap = {
  [assetId: string]: {
    name: string;
    slug: string;
  };
};

export type Asset = {
  name: string;
  slug: string;
  assetId: string;
};
