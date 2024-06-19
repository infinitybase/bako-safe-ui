import { getTransactionsSummaries, Provider } from 'fuels';

export type TxInputs = {
  getTransactionHistory: {
    address: string;
    providerUrl?: string;
  };
};

const faucetAddress =
  '0xd205d74dc2a0ffd70458ef19f0fa81f05ac727e63bf671d344c590ab300e134f';
export class TxService {
  static async getTransactionHistory({
    address,
    providerUrl = '',
  }: TxInputs['getTransactionHistory']) {
    const provider = await Provider.create(providerUrl || '');

    const txSummaries = await getTransactionsSummaries({
      provider,
      filters: {
        owner: address,
        first: 1000,
      },
    });

    // const sortedTransactions = txSummaries.transactions?.sort((a, b) => {
    //   const aTime = bn(a.time, 10);
    //   const bTime = bn(b.time, 10);
    //   return aTime.gt(bTime) ? -1 : 1;
    // });

    const operations = txSummaries.transactions.map(
      (transaction) => transaction.operations,
    );

    const deposits = operations.flatMap((tx) =>
      tx
        ? tx.filter(
            (filteredTx) =>
              filteredTx.to?.address === address &&
              filteredTx.to?.address !== faucetAddress &&
              // this last validation is also due the faucet.
              // the faucet makes a transaction where the vault send a value to it self
              filteredTx.to?.address !== filteredTx.from?.address,
          )
        : [],
    );

    const transfers = operations.flatMap((tx) =>
      tx
        ? tx.filter(
            (filteredTx) =>
              filteredTx.to?.address !== address &&
              filteredTx.to?.address !== faucetAddress,
          )
        : [],
    );

    return {
      transfers,
      deposits,
      pageInfo: txSummaries.pageInfo,
    };
  }
}
