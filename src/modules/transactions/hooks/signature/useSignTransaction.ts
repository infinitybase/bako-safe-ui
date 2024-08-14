import { ITransaction, TransactionStatus } from 'bakosafe';
import { randomBytes } from 'ethers';
import { useState } from 'react';

import { CookieName, CookiesConfig } from '@/config/cookies';
import { useContactToast } from '@/modules/addressBook/hooks/useContactToast';
import { useWalletSignMessage } from '@/modules/core';

import { useTransactionToast } from '../../providers/toast';
import { IUseTransactionList } from '../list';
import { useSendTransaction } from '../send/useSendTransaction';
import { useSignTransactionRequest } from './useSignTransactionRequest';

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
  pendingSignerTransactionsRefetch: () => void;
  homeTransactionsRefetch: () => void;
  vaultTransactionsRefetch: () => void;
}

const useSignTransaction = ({
  transactionList,
  pendingSignerTransactionsRefetch,
  homeTransactionsRefetch,
  vaultTransactionsRefetch,
}: IUseSignTransactionProps) => {
  const {
    pendingTransactions,
    request: { refetch: transactionsPageRefetch },
  } = transactionList;
  const [selectedTransaction, setSelectedTransaction] =
    useState<ITransaction>();

  const toast = useTransactionToast();
  const { warningToast } = useContactToast();
  const { executeTransaction } = useSendTransaction({
    onTransactionSuccess: () => {
      transactionsPageRefetch();
      pendingSignerTransactionsRefetch();
      homeTransactionsRefetch();
      vaultTransactionsRefetch();
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

  const request = useSignTransactionRequest({
    onSuccess: async () => {
      transactionsPageRefetch();
      homeTransactionsRefetch();
      vaultTransactionsRefetch();
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
    transactionsPageRefetch();
    pendingSignerTransactionsRefetch();
    homeTransactionsRefetch();
    vaultTransactionsRefetch();
  };

  return {
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
