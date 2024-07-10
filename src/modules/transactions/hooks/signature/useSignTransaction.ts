import { ITransaction, TransactionStatus } from 'bakosafe';
import { randomBytes } from 'ethers';
import { useCallback, useMemo } from 'react';

import { queryClient } from '@/config';
import { useContactToast } from '@/modules/addressBook/hooks/useContactToast';
import { useAuthStore } from '@/modules/auth';
import { invalidateQueries, useWalletSignMessage } from '@/modules/core';

import { useTransactionSend } from '../../providers';
import { useTransactionToast } from '../../providers/send/toast';
import { useSignTransactionRequest } from './useSignTransactionRequest';

export interface SignTransactionParams {
  txId: string;
  transactionID: string;
  predicateID: string;
}

export interface UseSignTransactionOptions {
  transaction: ITransaction;
}

const useSignTransaction = (options: UseSignTransactionOptions) => {
  const toast = useTransactionToast();

  const { warningToast } = useContactToast();
  const { account } = useAuthStore();

  const transactionSendContext = useTransactionSend();

  useMemo(() => {
    console.log('OPTIONS_TRANSCATIONS:', options);
    const transaction = options.transaction;

    const toSend =
      !!transaction &&
      transaction.status === TransactionStatus.PROCESS_ON_CHAIN &&
      !transactionSendContext.isExecuting(transaction);

    if (toSend) {
      console.log('INSIDE_IF_TOSEND:', options.transaction);
      transactionSendContext.executeTransaction(transaction);
    }
    return options.transaction;
  }, [options.transaction]);

  const refetchTransactionList = useCallback(() => {
    const queries = ['home', 'transaction', 'assets', 'balance'];
    queryClient.invalidateQueries({
      predicate: (query) =>
        queries.some((value) => query.queryHash.includes(value)),
    });
  }, []);

  const request = useSignTransactionRequest({
    onSuccess: () => {
      // refetchTransactionList();
      invalidateQueries();
      queryClient.invalidateQueries({
        queryKey: 'transaction',
        exact: false,
      });
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
