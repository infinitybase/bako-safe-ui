export enum Networks {
  MAINNET = 9889,
  TESTNET = 0,
}
export type NetworkName = 'MAINNET' | 'TESTNET';

export const resolveNetwork = (chainId: number): NetworkName => {
  switch (chainId) {
    case Networks.MAINNET:
      return 'MAINNET';
    case Networks.TESTNET:
      return 'TESTNET';
    default:
      return 'MAINNET';
  }
};
