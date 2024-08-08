import { ITransaction, TransactionStatus } from 'bakosafe';
import { randomBytes } from 'ethers';
import { useCallback, useMemo, useState } from 'react';

import { queryClient } from '@/config';
import { useContactToast } from '@/modules/addressBook/hooks/useContactToast';
import { useWalletSignMessage } from '@/modules/core';

import { useTransactionToast } from '../../providers/send/toast';
import { useSignTransactionRequest } from './useSignTransactionRequest';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

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
  const [currentTransaction, setCurrentTransaction] = useState<
    ITransaction | undefined
  >(undefined);
  const [pendingTransactions, setPendingTransactions] =
    useState<ITransaction[]>();

  const toast = useTransactionToast();

  const { warningToast } = useContactToast();
  const {
    authDetails: { userInfos },
  } = useWorkspaceContext();

  const signMessageRequest = useWalletSignMessage({
    onError: () => {
      warningToast({
        title: 'Signature failed',
        description: 'Please try again!',
      });
    },
  });

  // useMemo(() => {
  //   const toSend =
  //     !!currentTransaction &&
  //     currentTransaction.status === TransactionStatus.PROCESS_ON_CHAIN &&
  //     !isExecuting(currentTransaction);

  //   if (toSend) {
  //     executeTransaction(currentTransaction);
  //   }
  //   return currentTransaction;
  // }, [currentTransaction]);

  const refetchTransactionList = useCallback(async () => {
    const queries = ['home', 'transaction', 'assets', 'balance'];
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

  const confirmTransaction = async (
    selectedTransactionId: string,
    callback?: () => void,
  ) => {
    const selectedTransaction = pendingTransactions?.find(
      (transaction) => transaction.id === selectedTransactionId,
    );
    setCurrentTransaction(selectedTransaction);
    const signedMessage = await signMessageRequest.mutateAsync(
      currentTransaction!.hash,
    );

    await request.mutateAsync(
      {
        account: userInfos.address,
        confirm: true,
        signer: signedMessage,
        id: currentTransaction?.id!,
      },
      {
        onSuccess: () => {
          const toSend =
            !!currentTransaction &&
            currentTransaction.status === TransactionStatus.PROCESS_ON_CHAIN &&
            !isExecuting(currentTransaction);

          if (toSend) {
            executeTransaction(currentTransaction);
          }

          callback && callback();
        },
      },
    );
  };

  const retryTransaction = async () => {
    return executeTransaction(currentTransaction!);
  };

  const declineTransaction = async (transactionId: string) => {
    await request.mutateAsync({
      id: transactionId,
      confirm: false,
      account: userInfos.address,
    });
  };

  return {
    setPendingTransactions,
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
