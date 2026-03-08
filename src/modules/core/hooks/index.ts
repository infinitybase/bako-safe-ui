export * from './bakosafe';
export * from './useGetParams';
export * from './useGroupTransactionsByDay';

export interface AssetMap {
  [assetId: string]: {
    name: string;
    symbol: string;
    decimals: number;
    units?: number;
    isNFT?: boolean;
  };
}