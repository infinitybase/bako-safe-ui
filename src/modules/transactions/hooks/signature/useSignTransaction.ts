import { ITransaction, TransactionStatus } from 'bsafe';
import { randomBytes } from 'ethers';
import { useEffect, useMemo } from 'react';

import { queryClient } from '@/config';
import { useAuth, useAuthStore } from '@/modules/auth';
import { HomeQueryKey, useWalletSignMessage } from '@/modules/core';
import { useHome } from '@/modules/home';

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
  const { account } = useAuthStore();
  const {
    workspaces: { current },
  } = useAuth();

  const transactionSendContext = useTransactionSend();
  const { transactionsRequest, homeRequest } = useHome();

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

  const refetchTransactionList = () => {
    queryClient.invalidateQueries([HomeQueryKey.PENDING_TRANSACTIONS]);
    queryClient.invalidateQueries(HomeQueryKey.FULL_DATA(current));
    transactionsRequest.refetch();
    homeRequest.refetch();
  };

  const request = useSignTransactionRequest({
    onSuccess: () => {
      refetchTransactionList();
    },
    onError: () => {
      toast.generalError(randomBytes.toString(), 'Inválid signature');
    },
  });

  const signMessageRequest = useWalletSignMessage({
    onError: () => toast.error('Message sign rejected'),
  });

  const confirmTransaction = async () => {
    const signedMessage = await signMessageRequest.mutateAsync(
      options.transaction.hash,
    );
    await request.mutateAsync({
      account,
      confirm: true,
      signer: signedMessage,
      id: options.transaction.id,
    });
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

  useEffect(() => {
    if (
      options.transaction.status === TransactionStatus.PROCESS_ON_CHAIN &&
      (!homeRequest.isRefetching || !homeRequest.isFetching)
    ) {
      refetchTransactionList();
    }
  }, [
    homeRequest.isFetching,
    homeRequest.isRefetching,
    homeRequest.isSuccess,
    options.transaction.status,
    refetchTransactionList,
  ]);

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
