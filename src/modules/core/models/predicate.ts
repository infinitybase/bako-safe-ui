import { IPredicate } from 'bsafe';

import { Owner, WorkspaceContact } from '@/modules/core/models/workspace';

import { Transaction } from './transaction';
import { User } from './user';

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
}

export type PredicateWithWorkspace = IPredicate & {
  workspace: {
    id: string;
    addressBook: WorkspaceContact[];
  };
};

export interface SignersDetailsProps {
  vault: {
    id: string;
    isLoading: boolean;
    minSigners: number;
    owner: {
      id: string;
    };
    members: {
      id: string;
      avatar: string;
      address: string;
    }[];
    workspace: {
      id: string;
      addressBook: WorkspaceContact[];
    };
  };
}
