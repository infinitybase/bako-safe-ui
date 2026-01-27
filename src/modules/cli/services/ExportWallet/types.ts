export interface getPredicateByAddress {
  address: string;
}

export interface getPredicateByAddressResponse {
  name: string;
  version: number;
  members: Array<{
    id: string;
    address: string;
    avatar: string | null;
  }>;
  configurable: string;
}
