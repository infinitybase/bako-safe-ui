export interface TokenLayersSwap {
  symbol: string;
  display_asset: string;
  logo: string;
  contract: string;
  decimals: number;
  price_in_usd: number;
  precision: number;
  listing_date: Date;
  source_rank: number;
  destination_rank: number;
}

export interface INetworkLayersSwap {
  name: string;
  display_name: string;
  logo: string;
  chain_id: string;
  node_url: string;
  type: 'evm';
  transaction_explorer_template: string;
  account_explorer_template: string;
  source_rank: number;
  destination_rank: number;
  token: TokenLayersSwap;
  metadata: MetadataDestination;
  deposit_methods: ['string'];
}

export interface QuoteLayersSwap {
  total_fee: number;
  total_fee_in_usd: number;
  source_network: INetworkLayersSwap;
  source_token: TokenLayersSwap;
  destination_network: INetworkLayersSwap;
  destination_token: TokenLayersSwap;
  requested_amount: number;
  receive_amount: number;
  fee_discount: number;
  min_receive_amount: number;
  blockchain_fee: number;
  service_fee: number;
  avg_completion_time: string;
  refuel_in_source: number;
  slippage: number;
}

export interface RefuelLayersSwap {
  token: TokenLayersSwap;
  network: INetworkLayersSwap;
  amount: number;
  amount_in_usd: number;
}

export interface RewardLayersSwap {
  token: TokenLayersSwap;
  network: INetworkLayersSwap;
  amount: number;
  amount_in_usd: number;
  campaign_type: string;
  nft_contract_address: string;
}

export interface MetadataDestination {
  listing_date: Date;
  evm_oracle_contract: string;
  evm_multicall_contract: string;
  zks_paymaster_contract: string;
  watchdog_contract: string;
}

export interface IGetDestinationPayload {
  from_network: string;
  from_token: string;
}

export interface IGetDestinationsResponse {
  name: string;
  display_name: string;
  logo: string;
  tokens: {
    symbol: string;
    logo: string;
    decimals: number;
  }[];
}

export interface ICreateSwapBridgePayload {
  destination_address: string;
  source_network: string;
  source_token: string;
  destination_network: string;
  destination_token: string;
  amount: number;
  refuel: boolean;
  use_deposit_address: boolean;
  use_new_deposit_address?: null;
  reference_id?: null;
  source_address?: string | null;
  slippage?: null;
}

export interface ICreateSwapBridgeResponse {
  quote: QuoteLayersSwap;
  refuel: RefuelLayersSwap;
  reward: RewardLayersSwap;
  swap: {
    id: string;
    created_date: Date;
    source_network: INetworkLayersSwap;
    source_token: TokenLayersSwap;
    source_exchange: {
      name: string;
      display_name: string;
      logo: string;
      metadata: {
        oauth: {
          authorize_url: string;
          connect_url: string;
        };
        listing_date: Date;
      };
    };
    destination_network: INetworkLayersSwap;
    destination_token: TokenLayersSwap;
    destination_exchange: {
      name: string;
      display_name: string;
      logo: string;
      metadata: {
        oauth: {
          authorize_url: string;
          connect_url: string;
        };
        listing_date: Date;
      };
    };
    requested_amount: number;
    destination_address: string;
    status: string;
    fail_reason: string;
    use_deposit_address: true;
    metadata: {
      sequence_number: number;
      reference_id: string;
      exchange_account: string;
    };
    transactions: [
      {
        from: string;
        to: string;
        timestamp: Date;
        transaction_hash: string;
        confirmations: number;
        max_confirmations: number;
        amount: number;
        type: string;
        status: string;
        token: TokenLayersSwap;
        network: INetworkLayersSwap;
        fee_amount: number;
        fee_token: TokenLayersSwap;
      },
    ];
  };
  deposit_actions: [
    {
      type: string;
      to_address: string;
      amount: number;
      order: number;
      amount_in_base_units: string;
      network: INetworkLayersSwap;
      token: TokenLayersSwap;
      fee_token: TokenLayersSwap;
      call_data: string;
    },
  ];
}

export interface IGetQuotesResponse {
  quote: QuoteLayersSwap;
  refuel: RefuelLayersSwap;
  reward: RewardLayersSwap;
}

export interface IQuoteFormLayersSwap {
  quote: QuoteLayersSwap;
  receive_in_usd: string;
}

export interface IGetLimitsResponse {
  min_amount_in_usd: number;
  min_amount: number;
  max_amount_in_usd: number;
  max_amount: number;
}
