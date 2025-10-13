export interface TokenLayersSwap {
  symbol: string;
  displayAsset: string;
  logo: string;
  contract: string;
  decimals: number;
  priceInUsd: number;
  precision: number;
  listingDate: Date;
  sourceRank: number;
  destinationRank: number;
}

export interface MetadataDestination {
  listingDate: Date;
  evmOracleContract: string;
  evmMulticallContract: string;
  zksPaymasterContract: string;
  watchdogContract: string;
}

export interface INetworkLayersSwap {
  name: string;
  displayName: string;
  logo: string;
  chainId: string;
  nodeUrl: string;
  type: 'evm';
  transactionExplorerTemplate: string;
  accountExplorerTemplate: string;
  sourceRank: number;
  destinationRank: number;
  token: TokenLayersSwap;
  metadata: MetadataDestination;
  depositMethods: string[];
}

export interface QuoteLayersSwap {
  totalFee: number;
  totalFeeInUsd: number;
  sourceNetwork: INetworkLayersSwap;
  sourceToken: TokenLayersSwap;
  destinationNetwork: INetworkLayersSwap;
  destinationToken: TokenLayersSwap;
  requestedAmount: number;
  receiveAmount: number;
  feeDiscount: number;
  minReceiveAmount: number;
  blockchainFee: number;
  serviceFee: number;
  avgCompletionTime: string;
  refuelInSource: number;
  slippage: number;
}
export interface RefuelLayersSwap {
  token: TokenLayersSwap;
  network: INetworkLayersSwap;
  amount: number;
  amountInUsd: number;
}

export interface RewardLayersSwap {
  token: TokenLayersSwap;
  network: INetworkLayersSwap;
  amount: number;
  amountInUsd: number;
  campaign_type: string;
  nftContractAddress: string;
}

export interface MetadataDestination {
  listingDate: Date;
  evmOracleContract: string;
  evmMulticallContract: string;
  zksPaymasterContract: string;
  watchdogContract: string;
}

export interface IGetDestinationPayload {
  fromNetwork: string;
  fromToken: string;
}

export interface IGetDestinationsResponse {
  name: string;
  displayName: string;
  logo: string;
  tokens: {
    symbol: string;
    logo: string;
    decimals: number;
  }[];
}

export interface ICreateSwapBridgePayload {
  destinationAddress: string;
  sourceNetwork: string;
  sourceToken: string;
  destinationNetwork: string;
  destinationToken: string;
  amount?: number;
  refuel?: boolean;
  useDepositAddress?: boolean;
  useNewDepositAddress?: null;
  referenceId?: null;
  sourceAddress?: string | null;
  slippage?: null;
}

export interface IInfoBridgeSwap {
  id: string;
  createdDate: Date;
  sourceNetwork: INetworkLayersSwap;
  sourceToken: {
    assetId: string;
    amount: number;
    to: string;
    decimals: number;
  };
  destinationNetwork: INetworkLayersSwap;
  destinationToken: {
    assetId: string;
    amount: number;
    to: string;
    decimals: number;
  };
  status: string;
}

export interface IUpdateSwapBridgeTxPayload {
  hash: string;
  swap: IInfoBridgeSwap;
}

export interface ISwapResponse {
  id: string;
  createdDate: Date;
  sourceNetwork: INetworkLayersSwap;
  sourceToken: TokenLayersSwap;
  sourceExchange: {
    name: string;
    displayName: string;
    logo: string;
    metadata: {
      oauth: {
        authorizeUrl: string;
        connectUrl: string;
      };
      listingDate: Date;
    };
  };
  destinationNetwork: INetworkLayersSwap;
  destinationToken: TokenLayersSwap;
  destinationExchange: {
    name: string;
    displayName: string;
    logo: string;
    metadata: {
      oauth: {
        authorizeUrl: string;
        connectUrl: string;
      };
      listingDate: Date;
    };
  };
  requestedAmount: number;
  destinationAddress: string;
  status: string;
  failReason: string;
  useDepositAddress: boolean;
  metadata: {
    sequenceNumber: number;
    referenceId: string;
    exchangeAccount: string;
  };
  transactions: [
    {
      from: string;
      to: string;
      timestamp: Date;
      transactionHash: string;
      confirmations: number;
      maxConfirmations: number;
      amount: number;
      type: string;
      status: string;
      token: TokenLayersSwap;
      network: INetworkLayersSwap;
      feeAmount: number;
      feeToken: TokenLayersSwap;
    },
  ];
}

export interface ICreateSwapBridgeResponse {
  quote: {
    totalFee: number;
    totalFeeInUsd: number;
    sourceNetwork: INetworkLayersSwap;
    sourceToken: TokenLayersSwap;
    destinationNetwork: INetworkLayersSwap;
    destinationToken: TokenLayersSwap;
    requestedAmount: number;
    receiveAmount: number;
    feeDiscount: number;
    minReceiveAmount: number;
    blockchainFee: number;
    serviceFee: number;
    avgCompletionTime: string;
    refuelInSource: number;
    slippage: number;
  };
  refuel: {
    token: TokenLayersSwap;
    network: INetworkLayersSwap;
    amount: number;
    amountInUsd: number;
  };
  reward: {
    token: TokenLayersSwap;
    network: INetworkLayersSwap;
    amount: number;
    amountInUsd: number;
    campaignType: string;
    nftContractAddress: string;
  };
  swap: ISwapResponse;
  depositActions: [
    {
      type: string;
      toAddress: string;
      amount: number;
      order: number;
      amountInBaseUnits: string;
      network: INetworkLayersSwap;
      token: TokenLayersSwap;
      feeToken: TokenLayersSwap;
      callData: string;
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
  receiveInUsd: string;
}

export interface IGetLimitsResponse {
  minAmountInUsd: number;
  minAmount: number;
  maxAmountInUsd: number;
  maxAmount: number;
}
