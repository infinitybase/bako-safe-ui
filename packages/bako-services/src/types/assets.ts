export enum AssetId {
  BTC = "BTC",
  ETH = "ETH",
  USDC = "USDC",
  UNI = "UNI",
  DAI = "DAI",
  sETH = "sETH",
  BAKO = "BAKO",
}

export interface AssetModel {
  to: string;
  recipientNickname?: string;
  assetId: string;
  amount: string;
  transactionID?: string;
}

export type Asset = {
  name: string;
  slug: string;
  assetId: string;
  icon?: string;
  amount?: string;
  units: number;
};

export type NFT = {
  amount: string;
  assetId: string;
};
