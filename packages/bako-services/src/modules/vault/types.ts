export interface IPredicateVersion {
  id: string;
  name: string;
  description?: string;
  code: string;
  bytes: string;
  abi: string;
  active: boolean;
}

export interface IPredicate extends IPredicatePayload {
  id: string;
  members: {
    id: string;
    avatar: string;
    address: string;
    nickname?: string;
  }[];
  owner: {
    id: string;
    address: string;
  };
  version: Partial<IPredicateVersion>;
  createdAt: string;
  updatedAt: string;
}

export interface IPredicatePayload {
  name: string;
  description?: string;
  predicateAddress: string;
  minSigners: number;
  addresses: string[];
  configurable: string;
  provider: string;
  chainId?: number;
  versionCode?: string;
}

export interface IVaultConfigurable {
  SIGNATURES_COUNT: number;
  SIGNERS: string[];
  HASH_PREDICATE: string;
}

export interface Predicate extends Omit<IPredicate, "configurable"> {
  configurable: IVaultConfigurable;
  root?: boolean;
}

export interface PredicateMember {
  id: string;
  avatar: string;
  address: string;
  isOwner?: boolean;
  nickname?: string;
}
