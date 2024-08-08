import { ITransaction, TransactionStatus } from 'bakosafe';
import { randomBytes } from 'ethers';
import { useCallback, useMemo, useState } from 'react';

import { queryClient } from '@/config';
import { useContactToast } from '@/modules/addressBook/hooks/useContactToast';
import { useAuthStore } from '@/modules/auth';
import { useWalletSignMessage } from '@/modules/core';

import { useTransactionToast } from '../../providers/send/toast';
import { useSignTransactionRequest } from './useSignTransactionRequest';
import { useTransactionList } from '../list';

export interface SignTransactionParams {
  txId: string;
  transactionID: string;
  predicateID: string;
}

export interface UseSignTransactionOptions {
  transaction: ITransaction;
}

interface IUseSignTransactionProps {
  isExecuting: (transaction: ITransaction) => boolean;
  executeTransaction: (transaction: ITransaction) => void;
}

const useSignTransaction = ({
  executeTransaction,
  isExecuting,
}: IUseSignTransactionProps) => {
  const [currentTransaction, setCurrentTransaction] = useState<any>();

  const {
    transactionRequest: { refetch: refetchTransactionsRequest },
  } = useTransactionList();

  const toast = useTransactionToast();

  const { warningToast } = useContactToast();
  const { account } = useAuthStore();

  const signMessageRequest = useWalletSignMessage({
    onError: () => {
      warningToast({
        title: 'Signature failed',
        description: 'Please try again!',
      });
    },
  });

  useMemo(() => {
    const transaction = currentTransaction;
    const toSend =
      !!transaction &&
      transaction.status === TransactionStatus.PROCESS_ON_CHAIN &&
      !isExecuting(transaction);

    if (toSend) {
      executeTransaction(transaction);
    }
    return currentTransaction;
  }, [currentTransaction]);

  const refetchTransactionList = useCallback(async () => {
    const queries = ['home', 'transaction', 'assets', 'balance'];
    await refetchTransactionsRequest();
    queryClient.invalidateQueries({
      predicate: (query) =>
        queries.some((value) => query.queryHash.includes(value)),
    });
  }, []);

  const request = useSignTransactionRequest({
    onSuccess: () => {
      refetchTransactionList();
    },
    onError: () => {
      toast.generalError(randomBytes.toString(), 'Invalid signature');
    },
  });

  const confirmTransaction = async (callback?: () => void) => {
    const signedMessage = await signMessageRequest.mutateAsync(
      currentTransaction.hash,
    );

    await request.mutateAsync(
      {
        account,
        confirm: true,
        signer: signedMessage,
        id: currentTransaction.id,
      },
      {
        onSuccess: () => {
          callback && callback();
        },
      },
    );
  };

  const retryTransaction = async () => {
    return executeTransaction(currentTransaction);
  };

  const declineTransaction = async (transactionId: string) => {
    await request.mutateAsync({
      id: transactionId,
      confirm: false,
      account,
    });
  };

  return {
    currentTransaction,
    setCurrentTransaction,
    request,
    signMessageRequest,
    confirmTransaction,
    retryTransaction,
    declineTransaction,
    isLoading:
      request.isPending ||
      signMessageRequest.isPending ||
      currentTransaction?.status === TransactionStatus.PROCESS_ON_CHAIN ||
      currentTransaction?.status === TransactionStatus.PENDING_SENDER,
    isSuccess: request.isSuccess,
  };
};

export { useSignTransaction };
