import { ITransaction, TransactionStatus } from 'bakosafe';
import { randomBytes } from 'ethers';
import { useEffect, useState } from 'react';

import { useContactToast } from '@/modules/addressBook/hooks/useContactToast';
import { useWalletSignMessage } from '@/modules/core';

import { useTransactionToast } from '../../providers/send/toast';
import { useSignTransactionRequest } from './useSignTransactionRequest';
import { CookieName, CookiesConfig } from '@/config/cookies';
import { useSendTransaction } from '../send/useSendTransaction';
import { IUseMeTransactionsReturn } from '../me';
import { IUseHomeTransactionsReturn } from '@/modules/home';
import { IUseTransactionList } from '../list';

export interface SignTransactionParams {
  txId: string;
  transactionID: string;
  predicateID: string;
}

export interface UseSignTransactionOptions {
  transaction: ITransaction;
}

interface IUseSignTransactionProps {
  transactionList: IUseTransactionList;
  meTransactions: IUseMeTransactionsReturn;
  homeTransactions: IUseHomeTransactionsReturn;
  setRequestInterval: React.Dispatch<React.SetStateAction<number>>;
}

const useSignTransaction = ({
  transactionList,
  homeTransactions,
  meTransactions,
  setRequestInterval,
}: IUseSignTransactionProps) => {
  const { transactionRequest, pendingTransactions } = transactionList;
  const [selectedTransaction, setSelectedTransaction] =
    useState<ITransaction>();
  const [canExecute, setCanExecute] = useState(false);

  const { executeTransaction } = useSendTransaction({
    homeTransactions,
    meTransactions,
    transactionList,
  });
  const toast = useTransactionToast();
  const { warningToast } = useContactToast();

  const signMessageRequest = useWalletSignMessage({
    onError: () => {
      warningToast({
        title: 'Signature failed',
        description: 'Please try again!',
      });
    },
  });

  console.log('pendingTransactions:', pendingTransactions);

  const request = useSignTransactionRequest({
    onSuccess: async () => {
      await transactionRequest.refetch();
      await homeTransactions.request.refetch();
      await meTransactions.transactionsRequest.refetch();
    },
    onError: () => {
      console.log('the erro come from here? ');
      toast.generalError(randomBytes.toString(), 'Invalid signature');
    },
  });

  const confirmTransaction = async (
    selectedTransactionId: string,
    callback?: () => void,
  ) => {
    const transaction = pendingTransactions?.[selectedTransactionId];

    const signedMessage = await signMessageRequest.mutateAsync(
      transaction!.hash,
    );
    setSelectedTransaction(transaction);

    await request.mutateAsync(
      {
        account: CookiesConfig.getCookie(CookieName.ADDRESS),
        confirm: true,
        signer: signedMessage,
        id: transaction?.id!,
      },
      {
        onSuccess: async () => {
          // setCanExecute(true);
          // console.log(
          //   'Success Signed:',
          //   pendingTransactions?.[selectedTransaction!.id],
          // );
          const tx = pendingTransactions?.[selectedTransaction!.id];
          const toSend =
            !!tx && tx.status === TransactionStatus.PROCESS_ON_CHAIN;
          // !isExecuting(transaction);

          if (toSend) {
            executeTransaction(tx);
            setSelectedTransaction(tx);
          }
          callback && callback();
        },
      },
    );
  };

  useEffect(() => {
    if (canExecute) {
      const tx = pendingTransactions?.[selectedTransaction!.id];
      const toSend = !!tx && tx.status === TransactionStatus.PROCESS_ON_CHAIN;
      // !isExecuting(transaction);

      if (toSend) {
        executeTransaction(tx);
        setSelectedTransaction(tx);
      }
    }
    setCanExecute(false);
  }, [canExecute, pendingTransactions, selectedTransaction]);

  const retryTransaction = async () => {
    return executeTransaction(selectedTransaction!);
  };

  const declineTransaction = async (transactionId: string) => {
    await request.mutateAsync({
      id: transactionId,
      confirm: false,
      account: CookiesConfig.getCookie(CookieName.ADDRESS),
    });
  };

  return {
    request,
    signMessageRequest,
    confirmTransaction,
    retryTransaction,
    declineTransaction,
    isLoading:
      request.isPending ||
      signMessageRequest.isPending ||
      selectedTransaction?.status === TransactionStatus.PROCESS_ON_CHAIN ||
      selectedTransaction?.status === TransactionStatus.PENDING_SENDER,
    isSuccess: request.isSuccess,
  };
};

export { useSignTransaction };

// const refetchTransactionList = useCallback(async () => {
//   const queries = ['home', 'transaction', 'assets', 'balance'];
//   queryClient.invalidateQueries({
//     predicate: (query) =>
//       queries.some((value) => query.queryHash.includes(value)),
//   });
// }, []);
