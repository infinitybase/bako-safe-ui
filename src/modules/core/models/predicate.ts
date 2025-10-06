import { UseVaultDetailsReturn } from '@/modules/vault';

import { IPredicate } from '../hooks/bakosafe/utils/types';

export interface PredicateMember {
  id: string;
  avatar: string;
  address: string;
  isOwner?: boolean;
  nickname?: string;
}

export interface IVaultConfigurable {
  SIGNATURES_COUNT: number;
  SIGNERS: string[];
  HASH_PREDICATE: string;
}

export interface Predicate extends Omit<IPredicate, 'configurable'> {
  configurable: IVaultConfigurable;
  root?: boolean;
}

export interface SignersDetailsProps {
  vault: UseVaultDetailsReturn['vault'];
}

export interface PredicateUpdatePayload
  extends Pick<Predicate, 'name' | 'description'> {}
