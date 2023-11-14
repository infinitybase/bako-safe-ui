import {
  getTransactionSummaryFromRequest,
  transactionRequestify,
} from '@fuel-ts/providers';
import {
  Provider,
  ScriptTransactionRequest,
  TransactionRequestLike,
} from 'fuels';

export interface TransactionSimulateParams {
  providerUrl: string;
  transactionLike: TransactionRequestLike;
}

class FuelTransactionService {
  static async simulate({
    providerUrl,
    transactionLike,
  }: TransactionSimulateParams) {
    const provider = await Provider.create(providerUrl);
    const transactionRequest = ScriptTransactionRequest.from(transactionLike);

    return getTransactionSummaryFromRequest({
      transactionRequest: transactionRequestify(transactionRequest),
      provider,
    });
  }
}

export { FuelTransactionService };
