import { User } from './user';

export interface Predicate {
  id: string;
  name: string;
  predicateAddress: string;
  description: string;
  minSigners: number;
  completeAddress: User[];
  addresses: string[];
  owner: string;
  bytes: string;
  abi: string;
  configurable: string;
  provider: string;
  chainId?: number;
}
