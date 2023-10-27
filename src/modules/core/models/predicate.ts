import { Transaction } from './transaction';
import { User } from './user';

export interface PredicateMember {
  id: string;
  avatar: string;
  address: string;
  isOwner?: boolean;
}

export interface Owner {
  id: string;
  address: string;
}

export interface Predicate {
  id: string;
  name: string;
  predicateAddress: string;
  description: string;
  minSigners: number;
  completeAddress: User[];
  addresses?: string[];
  owner: Owner;
  bytes: string;
  abi: string;
  configurable: string;
  provider: string;
  chainId?: number;
  members?: PredicateMember[];
  transactions: Transaction[];
}
