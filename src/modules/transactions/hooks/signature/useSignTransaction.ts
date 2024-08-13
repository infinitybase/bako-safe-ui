import { ITransaction, TransactionStatus } from 'bakosafe';
import { randomBytes } from 'ethers';
import { useState } from 'react';

import { useContactToast } from '@/modules/addressBook/hooks/useContactToast';
import { useWalletSignMessage } from '@/modules/core';

import { useTransactionToast } from '../../providers/toast';
import { useSignTransactionRequest } from './useSignTransactionRequest';
import { CookieName, CookiesConfig } from '@/config/cookies';
import { IUseMeTransactionsReturn } from '../me';

import {
  IUseTransactionList,
  IUseTransactionSignaturePendingReturn,
} from '../list';
import { useSendTransaction } from '../send/useSendTransaction';
import { IUseHomeTransactionsReturn } from '@/modules/home/hooks/useHomeTransactions';

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
  pendingSignerTransactions: IUseTransactionSignaturePendingReturn;
  homeTransactions: IUseHomeTransactionsReturn;
}

const useSignTransaction = ({
  transactionList,
  meTransactions,
  pendingSignerTransactions,
  homeTransactions,
}: IUseSignTransactionProps) => {
  const {
    pendingTransactions,
    request: { refetch },
  } = transactionList;
  const [selectedTransaction, setSelectedTransaction] =
    useState<ITransaction>();

  const toast = useTransactionToast();
  const { warningToast } = useContactToast();
  const { executeTransaction } = useSendTransaction({
    onTransactionSuccess: () => {
      refetch();
      meTransactions.request.refetch();
      pendingSignerTransactions.refetch();
      homeTransactions.request.refetch();
    },
  });

  const signMessageRequest = useWalletSignMessage({
    onError: (e) => {
      warningToast({
        title: 'Signature failed',
        description: 'Please try again!',
      });
    },
  });

  const request = useSignTransactionRequest({
    onSuccess: async () => {
      await transactionList.request.refetch();
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
          executeTransaction(transaction);
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
