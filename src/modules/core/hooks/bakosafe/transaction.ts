import {
  IBakoSafeAuth,
  IListTransactions,
  IPayloadTransfer,
  ITransaction,
  TransactionStatus,
  Vault,
} from 'bakosafe';

import { TransactionService } from '@/modules/transactions/services';

import { useBakoSafeMutation, useBakoSafeQuery } from './utils';

const TRANSACTION_QUERY_KEYS = {
  DEFAULT: ['bakosafe', 'transaction'],
  SEND: () => [...TRANSACTION_QUERY_KEYS.DEFAULT, 'send'],
  VAULT: (id: string, filter?: IListTransactions) => [
    ...TRANSACTION_QUERY_KEYS.DEFAULT,
    'vault',
    id,
    filter,
  ],
};

interface UseBakoSafeCreateTransactionParams {
  vault: Vault;
  onSuccess: () => void;
  onError: () => void;
}

const useBakoSafeCreateTransaction = ({
  vault,
  ...options
}: UseBakoSafeCreateTransactionParams) => {
  return useBakoSafeMutation(
    TRANSACTION_QUERY_KEYS.DEFAULT,
    async (payload: IPayloadTransfer) => {
      return vault?.BakoSafeIncludeTransaction({
        name: payload.name!,
        witnesses: payload.witnesses,
        assets: payload.assets,
      });
    },
    options,
  );
};

interface UseBakoSafeListTransactionParams {
  vault: Vault;
  filter?: IListTransactions & { limit: number; byMonth?: boolean };
}

const useBakoSafeTransactionList = ({
  vault,
  filter,
}: UseBakoSafeListTransactionParams) => {
  return useBakoSafeQuery(
    TRANSACTION_QUERY_KEYS.VAULT(vault?.BakoSafeVaultId, filter),
    async () => {
      return await TransactionService.getTransactions({
        predicateId: [vault?.BakoSafeVaultId],
        ...filter,
      });
    },
    { enabled: !!vault },
  );
};

interface UseBakoSafeSendTransactionParams {
  onSuccess: (transaction: ITransaction) => void;
  onError: (error: any) => void;
}

interface BakoSafeTransactionSendVariables {
  /* TODO: Send a transfer here */
  transaction: ITransaction;
  auth?: IBakoSafeAuth;
}

// const validateBalance = async (
//   vault: Vault,
//   _coins: ITransferAsset[],
//   id: string,
// ) => {
//   const balances = await vault.getBalances();
//   const coins = await Asset.assetsGroupById(
//     balances.map((item) => {
//       return {
//         assetId: item.assetId,
//         amount: item.amount.format(),
//         to: '',
//       };
//     }),
//   );

//   const _coinsTransaction = await Asset.assetsGroupById(_coins);

//   Object.entries(_coinsTransaction).map(([key, value]) => {
//     if (bn(coins[key]).lt(value)) {
//       throw new Error(`Insufficient balance for ${key}:${id}`);
//     }
//   });
// };

const useBakoSafeTransactionSend = (
  options: UseBakoSafeSendTransactionParams,
) => {
  return useBakoSafeMutation(
    TRANSACTION_QUERY_KEYS.SEND(),
    async ({ transaction, auth }: BakoSafeTransactionSendVariables) => {
      const vault = await Vault.create({
        id: transaction.predicateId,
        token: auth!.token,
        address: auth!.address,
      });

      // basicamente, qualquer transação com valor acima de 51% do vault, dará erro
      // porque o vault criado, ele tem como total balance o valor restante do "vaul original"
      // por exemplo, o faucet nos dá 0.000199 ETH, se eu faço uma transação de 60% desse valor, que é  de 0.001194
      // dará erro, porque esse vault criado tem apenas 0.00080165, que é o restante que sobrou após a transação ser feita
      // creio que para funcionar certo, tem que usar/instanciar o "vault original", onde o total amount é 0.000199
      // e não esse novo, que o total amont é o resto do valor inicial (0.000199) - o valor da transação.

      //await validateBalance(vault, transaction.assets, transaction.id);

      const transfer = await vault.BakoSafeGetTransaction(transaction.id);
      // console.log('[TRANSFER_ON_REQUEST_SEND]: ', {
      //   transfer,
      //   transaction,
      //   sending:
      //     transfer.BakoSafeTransaction.status ===
      //     TransactionStatus.PROCESS_ON_CHAIN,
      //   failed: transfer.BakoSafeTransaction.status === TransactionStatus.FAILED,
      // });
      if (transfer.BakoSafeTransaction.status === TransactionStatus.FAILED) {
        console.log('entrou no if?');
        await TransactionService.send(transfer.BakoSafeTransactionId);
      }
      const result = await transfer.wait();
      console.log('result', result);
      return (await vault.BakoSafeGetTransaction(transaction.id))
        .BakoSafeTransaction;
    },
    {
      onSuccess: options.onSuccess,
      onError: options.onError,
    },
  );
};

export {
  useBakoSafeCreateTransaction,
  useBakoSafeTransactionList,
  useBakoSafeTransactionSend,
};
