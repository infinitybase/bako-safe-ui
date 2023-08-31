export interface Predicate {
  name: string;
  address: string;
  description: string;
  minSigners: number;
  addresses: string[];
  owner: string;
  bytes: string;
  abi: string;
  configurable: string;
  network: string;
  _id: string;
}

export type GetPredicateResponse = Predicate;
export type CreatePredicateResponse = Predicate;
export type GetAllPredicateResponse = Predicate[];
export type CreatePredicatePayload = Omit<Predicate, '_id'>;
