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
}

const useSignTransaction = ({
  transactionList,
  meTransactions,
}: IUseSignTransactionProps) => {
  const { executeTransaction } = useSendTransaction();
  const { pendingTransactions } = transactionList;
  const [selectedTransaction, setSelectedTransaction] =
    useState<ITransaction>();

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

  const request = useSignTransactionRequest({
    onSuccess: async () => {
      await transactionList.request.refetch();
      await meTransactions?.request?.refetch();
    },
    onError: () => {
      toast.generalError(randomBytes.toString(), 'Invalid signature');
    },
  });

  const confirmTransaction = async (
    selectedTransactionId: string,
    callback?: () => void,
  ) => {
    const transaction = pendingTransactions?.[selectedTransactionId];

    console.log('selectedTransactionId;', selectedTransactionId);

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
          callback && callback();
        },
      },
    );
  };

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
