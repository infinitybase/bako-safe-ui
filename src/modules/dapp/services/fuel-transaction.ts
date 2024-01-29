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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      transactionRequest: transactionRequestify(transactionRequest),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      provider,
    });
  }
}

export { FuelTransactionService };
