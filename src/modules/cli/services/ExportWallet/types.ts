export interface GetPredicateByAddress {
  address: string;
}

export interface GetPredicateByAddressResponse {
  name: string;
  configurable: string;
}

export interface ExportedWalletConfig {
  name: string;
  config: Record<string, unknown>;
}
