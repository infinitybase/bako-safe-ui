import { Owner, WorkspaceOnVault } from '@/modules/core/models/workspace';
import { UseVaultDetailsReturn } from '@/modules/vault';

import { Transaction } from './transaction';
import { User } from './user';
import { IPredicate } from '../hooks/bakosafe/utils/types';

export interface PredicateMember {
  id: string;
  avatar: string;
  address: string;
  isOwner?: boolean;
  nickname?: string;
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
  root?: boolean;
}

export type PredicateWithWorkspace = IPredicate & WorkspaceOnVault;

export interface SignersDetailsProps {
  vault: UseVaultDetailsReturn['vault'];
}
