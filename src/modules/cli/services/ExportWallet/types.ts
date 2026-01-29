export interface GetPredicateByAddress {
  address: string;
}

export interface GetPredicateByAddressResponse {
  name: string;
  version: string;
  members: Array<{
    id: string;
    address: string;
    avatar: string | null;
  }>;
  configurable: string;
}

export interface ExportedWalletConfig {
  config: Record<string, unknown>;
  version: string;
  name: string;
}
