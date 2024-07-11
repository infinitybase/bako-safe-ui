import { ITransaction, TransactionStatus } from 'bakosafe';
import { randomBytes } from 'ethers';
import { useCallback, useMemo, useState } from 'react';

import { queryClient } from '@/config';
import { useContactToast } from '@/modules/addressBook/hooks/useContactToast';
import { useAuthStore } from '@/modules/auth';
import {
  WorkspacesQueryKey,
  invalidateQueries,
  useWalletSignMessage,
} from '@/modules/core';

import { useTransactionSend } from '../../providers';
import { useTransactionToast } from '../../providers/send/toast';
import { useSignTransactionRequest } from './useSignTransactionRequest';
import { PENDING_TRANSACTIONS_QUERY_KEY, useTransactionList } from '../list';

export interface SignTransactionParams {
  txId: string;
  transactionID: string;
  predicateID: string;
}

export interface UseSignTransactionOptions {
  transaction: ITransaction;
}

const useSignTransaction = (options: UseSignTransactionOptions) => {
  const {
    transactionRequest: {
      refetch: refetchTransactionsRequest,
      isLoading,
      isFetching,
    },
  } = useTransactionList();

  const toast = useTransactionToast();
  const [confirmedSignture, setConfirmedSignture] = useState(false);

  const { warningToast } = useContactToast();
  const {
    account,
    workspaces: { current },
  } = useAuthStore();

  const transactionSendContext = useTransactionSend();

  useMemo(() => {
    const transaction = options.transaction;

    const toSend =
      !!transaction &&
      transaction.status === TransactionStatus.PROCESS_ON_CHAIN &&
      !transactionSendContext.isExecuting(transaction);

    if (toSend) {
      transactionSendContext.executeTransaction(transaction);
    }
    return options.transaction;
  }, [options.transaction]);

  const refetchTransactionList = useCallback(() => {
    const queries = ['home', 'transaction', 'assets', 'balance'];
    refetchTransactionsRequest();
    queryClient.invalidateQueries({
      predicate: (query) =>
        queries.some((value) => query.queryHash.includes(value)),
    });
  }, []);

  // Account 12, todas as tx falharam tentando usar
  // queryClient.invalidateQueries({
  //   queryKey: [
  //     WorkspacesQueryKey.TRANSACTION_LIST_PAGINATION_QUERY_KEY(current),
  //     WorkspacesQueryKey.FULL_DATA,
  //     PENDING_TRANSACTIONS_QUERY_KEY,
  //     'transaction',
  //   ],
  //   exact: false,
  // });
  // e invalidateQueries(); que isso é errado mas se funcionasse, confirmaria a ideia de que o problema é invalidação

  // Account 14 - Todos tiveram sucesso usando refetch diretamente do hook de tx list: "refetchTransactionsRequest()"

  const request = useSignTransactionRequest({
    onSuccess: async (isSignatureConfirmed) => {
      // if (isSignatureConfirmed) {
      // @ts-ignore
      // setConfirmedSignture(isSignatureConfirmed);
      // console.log('isLoading BEFORE___refetch:', isLoading);
      // console.log('isFetching BEFORE___refetch:', isFetching);
      refetchTransactionList();
      // console.log('isLoading AFTER___refetch:', isLoading);
      // console.log('isFetching AFTER___refetch:', isFetching);
      // }
      // invalidateQueries();
      // queryClient.invalidateQueries({
      //   queryKey: [
      //     'workspace',
      //     'transaction-list-pagination',
      //     'transactions/list',
      //     'home',
      //   ],
      //   // queryKey: [
      //   //   WorkspacesQueryKey.TRANSACTION_LIST_PAGINATION_QUERY_KEY(current),
      //   //   // WorkspacesQueryKey.FULL_DATA,
      //   //   // PENDING_TRANSACTIONS_QUERY_KEY,
      //   // ],
      // });
    },
    onError: () => {
      toast.generalError(randomBytes.toString(), 'Invalid signature');
    },
  });

  const signMessageRequest = useWalletSignMessage({
    onError: () => {
      warningToast({
        title: 'Signature failed',
        description: 'Please try again!',
      });
    },
  });

  const confirmTransaction = async (callback?: () => void) => {
    const signedMessage = await signMessageRequest.mutateAsync(
      options.transaction.hash,
    );

    await request.mutateAsync(
      {
        account,
        confirm: true,
        signer: signedMessage,
        id: options.transaction.id,
      },
      {
        onSuccess: () => {
          callback && callback();
        },
      },
    );
  };

  const retryTransaction = async () => {
    return transactionSendContext.executeTransaction(options.transaction);
  };

  const declineTransaction = async (transactionId: string) => {
    await request.mutateAsync({
      id: transactionId,
      confirm: false,
      account,
    });
  };

  return {
    request,
    signMessageRequest,
    confirmTransaction,
    retryTransaction,
    declineTransaction,
    isLoading:
      request.isLoading ||
      signMessageRequest.isLoading ||
      options.transaction.status === TransactionStatus.PROCESS_ON_CHAIN ||
      options.transaction.status === TransactionStatus.PENDING_SENDER,
    isSuccess: request.isSuccess,
  };
};

export { useSignTransaction };
