export interface ICountry {
  countryCode: string;
  flagImageUrl: string;
  name: string;
}

export interface IFiatCurrency {
  name: string;
  currencyCode: string;
  symbolImageUrl: string;
}

export interface ICryptoCurrency {
  chainCode: string;
  chainId: string;
  chainName: string;
  name: string;
  contractAddress: string;
  symbolImageUrl: string;
  currencyCode: string;
}

export interface IPaymentMethod {
  logos: {
    light: string;
    dark: string;
  };
  name: string;
  paymentMethod: string;
  paymentType: string;
}

export interface IQuote {
  countryCode: string;
  customerScore: number;
  destinationAmount: number;
  destinationAmountWithoutFees: number;
  destinationCurrencyCode: string;
  exchangeRate: number;
  fiatAmountWithoutFees: number;
  institutionName: string;
  lowKyc: boolean;
  networkFee: number;
  partnerFee: number;
  paymentMethodType: string;
  serviceProvider: string;
  sourceAmount: number;
  sourceAmountWithoutFees: number;
  sourceCurrencyCode: string;
  totalFee: number;
  transactionFee: number;
  transactionType: string;
}

export interface IQuoteResponse {
  message?: string;
  error?: unknown;
  quotes: IQuote[];
}

export interface ICreateWidgetPayload {
  type: 'BUY' | 'SELL';
  countryCode: string;
  destinationCurrencyCode: string;
  sourceAmount: string;
  sourceCurrencyCode: string;
  serviceProvider: string;
  walletAddress?: string;
  paymentMethodType: string;
}

export interface ICreateWidgetResponse {
  id: string;
  provider: string;
}

export interface IQuotePayload
  extends Omit<
    ICreateWidgetPayload,
    'type' | 'serviceProvider' | 'sourceAmount'
  > {
  sourceAmount: number;
}

export interface IServiceProviderResponse {
  serviceProvider: string;
  name: string;
  status: string;
  categories: string[];
  categoryStatuses: {
    CRYPTO_OFFRAMP: string;
    CRYPTO_ONRAMP: string;
  };
  websiteUrl: string;
  customerSupportUrl?: string;
  logos: {
    dark: string;
    light: string;
    darkShort: string;
    lightShort: string;
  };
}

export interface IPurchaseLimitsParams {
  countries: string;
  fiatCurrencies: string;
  cryptoChains: string;
  cryptoCurrencies: string;
  paymentMethodTypes: string;
}

export interface IPurchaseLimitsResponse {
  currencyCode: string;
  defaultAmount: number;
  maximumAmount: number;
  minimumAmount: number;
}
