export interface Predicate {
  id: string;
  name: string;
  predicateAddress: string;
  description: string;
  minSigners: number;
  addresses: string[];
  owner: string;
  bytes: string;
  abi: string;
  configurable: string;
  provider: string;
  chainId?: number;
}
